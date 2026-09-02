import fs from "node:fs";
import path from "node:path";

const allowedStatuses = new Set(["PASS", "FAIL", "UNKNOWN"]);
const requiredCriterionIds = Array.from({ length: 12 }, (_, index) => `AC${index + 1}`);
const errors = [];

function fail(message) {
  errors.push(message);
}

function isNonTodoText(value) {
  return typeof value === "string"
    && value.trim().length > 0
    && !/\b(?:TODO|TBD)\b|待补|未填写/i.test(value);
}

function expectStringArray(value, field) {
  if (!Array.isArray(value)) {
    fail(`${field} must be an array.`);
    return false;
  }
  value.forEach((item, index) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      fail(`${field}[${index}] must be a non-empty string.`);
    }
  });
  return true;
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function validateProofPath(taskRoot, taskRootReal, proofPath, field) {
  if (typeof proofPath !== "string" || proofPath.trim().length === 0) {
    fail(`${field} must be a non-empty path string.`);
    return;
  }
  if (path.isAbsolute(proofPath)) {
    fail(`${field} must be relative to the task directory: ${proofPath}`);
    return;
  }

  const candidate = path.resolve(taskRoot, proofPath);
  if (!isInside(taskRoot, candidate)) {
    fail(`${field} escapes the task directory: ${proofPath}`);
    return;
  }
  if (!fs.existsSync(candidate)) {
    fail(`${field} does not exist: ${proofPath}`);
    return;
  }

  const candidateReal = fs.realpathSync(candidate);
  if (!isInside(taskRootReal, candidateReal)) {
    fail(`${field} resolves outside the task directory: ${proofPath}`);
  }
}

function validateCommands(commands, field) {
  if (!Array.isArray(commands)) {
    fail(`${field} must be an array.`);
    return false;
  }
  commands.forEach((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      fail(`${field}[${index}] must be an object.`);
      return;
    }
    if (typeof entry.command !== "string" || entry.command.trim().length === 0) {
      fail(`${field}[${index}].command must be a non-empty string.`);
    }
    if (!Number.isInteger(entry.exit_code)) {
      fail(`${field}[${index}].exit_code must be an integer.`);
    }
  });
  return true;
}

function expectedOverall(criteria) {
  if (criteria.some((criterion) => criterion?.status === "FAIL")) return "FAIL";
  if (criteria.some((criterion) => criterion?.status === "UNKNOWN")) return "UNKNOWN";
  return "PASS";
}

const taskId = process.argv[2];
if (!taskId || !/^[a-z0-9][a-z0-9-]*$/.test(taskId)) {
  console.error("Usage: node scripts/validate-task-proof.mjs <task-id>");
  process.exit(2);
}

const repoRoot = process.cwd();
const taskRoot = path.resolve(repoRoot, ".agent", "tasks", taskId);
const tasksRoot = path.resolve(repoRoot, ".agent", "tasks");
if (!isInside(tasksRoot, taskRoot) || !fs.existsSync(taskRoot)) {
  console.error(`Task directory does not exist: ${taskRoot}`);
  process.exit(1);
}

const taskRootReal = fs.realpathSync(taskRoot);
const evidencePath = path.join(taskRoot, "evidence.json");
let evidence;
try {
  evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
} catch (error) {
  console.error(`FAIL: cannot parse ${evidencePath}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (evidence.task_id !== taskId) {
  fail(`task_id must equal ${taskId}.`);
}
if (!allowedStatuses.has(evidence.overall_status)) {
  fail("overall_status must be PASS, FAIL, or UNKNOWN.");
}
expectStringArray(evidence.changed_files, "changed_files");
expectStringArray(evidence.commands_for_fresh_verifier, "commands_for_fresh_verifier");
expectStringArray(evidence.known_gaps, "known_gaps");

const criteria = evidence.acceptance_criteria;
if (!Array.isArray(criteria)) {
  fail("acceptance_criteria must be an array.");
} else {
  const actualIds = criteria.map((criterion) => criterion?.id);
  if (actualIds.length !== requiredCriterionIds.length
    || actualIds.some((id, index) => id !== requiredCriterionIds[index])) {
    fail(`acceptance_criteria must contain AC1 through AC12 exactly once and in order; received ${actualIds.join(", ")}.`);
  }

  criteria.forEach((criterion, criterionIndex) => {
    const field = `acceptance_criteria[${criterionIndex}]`;
    if (!criterion || typeof criterion !== "object" || Array.isArray(criterion)) {
      fail(`${field} must be an object.`);
      return;
    }
    if (!isNonTodoText(criterion.text)) {
      fail(`${field}.text must be non-empty and must not contain TODO/TBD language.`);
    }
    if (!allowedStatuses.has(criterion.status)) {
      fail(`${field}.status must be PASS, FAIL, or UNKNOWN.`);
    }
    const commandsValid = validateCommands(criterion.commands, `${field}.commands`);
    const proofValid = expectStringArray(criterion.proof, `${field}.proof`);
    const gapsValid = expectStringArray(criterion.gaps, `${field}.gaps`);

    if (proofValid) {
      criterion.proof.forEach((proofPath, proofIndex) => {
        validateProofPath(taskRoot, taskRootReal, proofPath, `${field}.proof[${proofIndex}]`);
      });
    }
    if (criterion.status === "PASS") {
      if (commandsValid && criterion.commands.length === 0) {
        fail(`${field}.commands must not be empty when status is PASS.`);
      }
      criterion.commands?.forEach((command, commandIndex) => {
        if (command?.exit_code !== 0) {
          fail(`${field}.commands[${commandIndex}] must have exit_code 0 when status is PASS.`);
        }
      });
      if (proofValid && criterion.proof.length === 0) {
        fail(`${field}.proof must not be empty when status is PASS.`);
      }
      if (gapsValid && criterion.gaps.length !== 0) {
        fail(`${field}.gaps must be empty when status is PASS.`);
      }
    } else if (gapsValid && criterion.gaps.length === 0) {
      fail(`${field}.gaps must explain every non-PASS status.`);
    }
  });

  const expected = expectedOverall(criteria);
  if (evidence.overall_status !== expected) {
    fail(`overall_status must be ${expected} for the current criterion statuses.`);
  }
}

if (evidence.overall_status === "PASS") {
  if (evidence.known_gaps?.length !== 0) {
    fail("known_gaps must be empty when overall_status is PASS.");
  }
  if (evidence.commands_for_fresh_verifier?.length === 0) {
    fail("commands_for_fresh_verifier must not be empty when overall_status is PASS.");
  }
}

if (errors.length > 0) {
  console.error(`FAIL: ${taskId} evidence has ${errors.length} validation error(s).`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`PASS: ${taskId} evidence is structurally valid and all proof paths are contained in the task directory.`);
