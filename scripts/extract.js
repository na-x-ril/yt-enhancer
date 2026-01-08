import fs from "fs";
import path from "path";

// ===== ARGS =====
const INPUT_FILE = process.argv[2];
const TARGET_KEY = process.argv[3];

if (!INPUT_FILE || !TARGET_KEY) {
  console.error("Usage: node extract.js <file.json> <key>");
  process.exit(1);
}
// =================

function findKeyDeep(obj, targetKey, currentPath = []) {
  if (typeof obj !== "object" || obj === null) return [];

  let results = [];

  for (const key of Object.keys(obj)) {
    const nextPath = [...currentPath, key];

    if (key === targetKey) {
      results.push({
        path: nextPath.join("."),
        value: obj[key],
      });
    }

    results = results.concat(findKeyDeep(obj[key], targetKey, nextPath));
  }

  return results;
}

// ===== MAIN =====
const filePath = path.resolve(INPUT_FILE);
const raw = fs.readFileSync(filePath, "utf-8");
const json = JSON.parse(raw);

const matches = findKeyDeep(json, TARGET_KEY);

if (matches.length === 0) {
  console.log(`Key "${TARGET_KEY}" not found`);
  process.exit(0);
}

console.log(JSON.stringify(matches, null, 2));
