import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import sanitizeHtml from "sanitize-html";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
const packageLock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url)));

function lockedVersions(packageName) {
  const suffix = `/node_modules/${packageName}`;
  return [
    ...new Set(
      Object.entries(packageLock.packages)
        .filter(([path]) => path === `node_modules/${packageName}` || path.endsWith(suffix))
        .map(([, metadata]) => metadata.version)
    ),
  ].sort();
}

function numericVersionAtLeast(version, minimum) {
  const current = version.split(".").map(Number);
  const floor = minimum.split(".").map(Number);
  for (let index = 0; index < Math.max(current.length, floor.length); index += 1) {
    if ((current[index] ?? 0) !== (floor[index] ?? 0)) {
      return (current[index] ?? 0) > (floor[index] ?? 0);
    }
  }
  return true;
}

test("the lock root exactly matches declared dependencies", () => {
  assert.deepEqual(packageLock.packages[""].dependencies, packageJson.dependencies);
  assert.deepEqual(packageLock.packages[""].devDependencies, packageJson.devDependencies);
  assert.equal(packageJson.dependencies.next, "16.3.1");
  assert.equal(packageJson.devDependencies["eslint-config-next"], "16.3.1");
  assert.equal(packageJson.dependencies["sanitize-html"], "^2.17.5");
});

test("every repaired parallel dependency line remains above its fixed floor", () => {
  const minimumByMajor = {
    "brace-expansion": { 1: "1.1.16", 5: "5.0.7" },
    "js-yaml": { 3: "3.15.1", 4: "4.3.1" },
  };

  for (const [packageName, floors] of Object.entries(minimumByMajor)) {
    const versions = lockedVersions(packageName);
    assert.ok(versions.length > 0, `${packageName} must remain locked`);
    for (const version of versions) {
      const floor = floors[Number(version.split(".")[0])];
      assert.ok(floor, `unexpected ${packageName} major: ${version}`);
      assert.ok(
        numericVersionAtLeast(version, floor),
        `${packageName} ${version} is below ${floor}`
      );
    }
  }

  assert.ok(lockedVersions("sharp").every((version) => numericVersionAtLeast(version, "0.35.0")));
  assert.ok(lockedVersions("yaml").every((version) => numericVersionAtLeast(version, "2.8.3")));
});

test("the repaired HTML sanitizer removes active content", () => {
  const clean = sanitizeHtml(
    '<p onclick="steal()">safe</p><a href="javascript:steal()">link</a><script>steal()</script>',
    {
      allowedTags: ["p", "a"],
      allowedAttributes: { a: ["href"] },
    }
  );

  assert.equal(clean, "<p>safe</p><a>link</a>");
});
