import path from "node:path";

const writesCanonicalEvidence = process.env.DEADLINE_CARL_EVIDENCE === "1";
const updatesVisualBaselines = process.env.UPDATE_VISUAL_BASELINES === "1";
const deadlineCarlOutput = process.env.DEADLINE_CARL_OUTPUT_DIR;

export function resolveProofRawRoot(taskId: string) {
  return writesCanonicalEvidence
    ? path.resolve(process.cwd(), ".agent", "tasks", taskId, "raw")
    : deadlineCarlOutput
      ? path.resolve(deadlineCarlOutput, "proof-raw")
      : path.resolve(process.cwd(), "test-results", "deadline-carl", taskId, "raw");
}

export function resolveVisualBaselineDirectory() {
  return updatesVisualBaselines
    ? path.resolve(process.cwd(), "tests", "e2e", "visual-baselines")
    : deadlineCarlOutput
      ? path.resolve(deadlineCarlOutput, "visual-baselines")
      : path.resolve(process.cwd(), "test-results", "visual-baselines");
}
