import { closeSync, mkdirSync, openSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export function portableDataPath(executable, portableDirectory) {
  return resolve(portableDirectory || dirname(executable), "血蛊引-data");
}

export function prepareDataDirectory(directory) {
  mkdirSync(directory, { recursive: true });
  const probe = resolve(directory, `.write-test-${randomUUID()}`);
  closeSync(openSync(probe, "wx"));
  unlinkSync(probe);
}
