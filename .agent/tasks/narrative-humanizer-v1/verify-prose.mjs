import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";

const baseline = "cd2057f49ce757380d342df2a14a8f243aa49ff5";
const files = [
  "lib/xue-gu-yin/story/events/act1.ts",
  "lib/xue-gu-yin/story/events/act2.ts",
  "lib/xue-gu-yin/story/common/choices.ts",
  "lib/xue-gu-yin/story/routes/traitor.ts",
  "lib/xue-gu-yin/story/routes/ji.ts",
  "lib/xue-gu-yin/story/routes/zhao.ts",
  "features/xue-gu-yin/XueGuYinGame.tsx",
];

function structure(file, source) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  assert.equal(ast.parseDiagnostics.length, 0, `${file}: parse errors`);
  function isCopy(node) {
    for (let child = node, parent = node.parent; parent; child = parent, parent = parent.parent) {
      if (ts.isPropertyAssignment(parent)) {
        return ["text", "result"].includes(parent.name.getText(ast)) && parent.initializer === child;
      }
      if (ts.isVariableDeclaration(parent)) {
        return file.endsWith("/traitor.ts") && ["traitorTrailConvergence", "traitorQiaoTriumphConvergence"].includes(parent.name.getText(ast));
      }
    }
    return false;
  }
  function walk(node) {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
      || [ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind)) && isCopy(node)) {
      return [node.kind, "PLAYER_COPY"];
    }
    if (file.endsWith(".tsx") && node.kind === ts.SyntaxKind.JsxText
      && ["剧情与按钮以更静止的方式呈现", "减少剧情与按钮的动画效果"].includes(node.getText(ast))) {
      return [node.kind, "REDUCED_MOTION_COPY"];
    }
    const children = node.getChildren(ast);
    return [node.kind, children.length ? children.map(walk) : node.getText(ast)];
  }
  return walk(ast);
}

const results = files.map((file) => {
  const before = execFileSync("git", ["show", `${baseline}:${file}`], { encoding: "utf8" });
  const after = readFileSync(file, "utf8");
  assert.deepEqual(structure(file, after), structure(file, before), `${file}: non-copy structure changed`);
  return { file, status: "PASS", beforeCharacters: before.replace(/\r\n/g, "\n").length, afterCharacters: after.replace(/\r\n/g, "\n").length };
});
const otherChanged = execFileSync("git", ["diff", baseline, "--name-only"], { encoding: "utf8" })
  .trim().split(/\r?\n/).filter((file) => file && !files.includes(file)
    && !["tests/game.test.ts", "tests/pagination.test.ts", "tests/e2e/pagination.spec.ts", "tests/e2e/narrative-copy.spec.ts"].includes(file)
    && !file.startsWith(".agent/tasks/narrative-humanizer-v1/"));
assert.deepEqual(otherChanged, [], "Unexpected tracked changes, including packages or story data");
console.log(JSON.stringify({ baseline, status: "PASS", results }, null, 2));
