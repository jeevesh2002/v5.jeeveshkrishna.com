import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
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
  assert.match(version, /^\d+\.\d+\.\d+$/, `expected a stable release: ${version}`);
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
  assert.equal(packageJson.devDependencies["eslint-config-next"], packageJson.dependencies.next);
  assert.equal(packageJson.dependencies["react-dom"], packageJson.dependencies.react);
});

test("the framework and renderer retain their security patches", () => {
  // Next.js August 2026 security release: GHSA-2xp9-vwfh-vxw4 and GHSA-p293-qw3h-jr36.
  for (const [name, minimum] of Object.entries({
    next: "16.3.3",
    "eslint-config-next": "16.3.3",
    react: "19.2.8",
    "react-dom": "19.2.8",
  })) {
    const versions = lockedVersions(name);
    assert.ok(versions.length > 0, `${name} must remain locked`);
    assert.ok(
      versions.every((version) => numericVersionAtLeast(version, minimum)),
      `${name} resolves below ${minimum}: ${versions.join(", ")}`
    );
  }
});

test("every repaired parallel dependency line remains above its fixed floor", () => {
  const sanitizerVersions = lockedVersions("sanitize-html");
  assert.ok(sanitizerVersions.length > 0, "sanitize-html must remain locked");
  assert.ok(
    sanitizerVersions.every((version) => numericVersionAtLeast(version, "2.17.7")),
    `sanitize-html resolves below its fixed floor: ${sanitizerVersions.join(", ")}`
  );

  const minimumByMajor = {
    "brace-expansion": { 1: "1.1.16", 5: "5.0.7" },
    // GHSA-2883-xcg3-v3hh affects both dependency lines.
    "js-yaml": { 3: "3.15.2", 4: "4.3.2" },
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

  // GHSA-rgj7-g3m4-5g8c fixes the vulnerable libheif dependency.
  const sharpVersions = lockedVersions("sharp");
  assert.ok(sharpVersions.length > 0, "sharp must remain locked");
  assert.ok(sharpVersions.every((version) => numericVersionAtLeast(version, "0.35.4")));
  assert.ok(lockedVersions("yaml").every((version) => numericVersionAtLeast(version, "2.8.3")));
});

test("all installed YAML parsers count empty merge sources against their work budget", () => {
  const require = createRequire(import.meta.url);
  const yamlPaths = Object.keys(packageLock.packages).filter(
    (path) => path === "node_modules/js-yaml" || path.endsWith("/node_modules/js-yaml")
  );
  // Small input and explicit budget exercise the fix without a CPU exhaustion test.
  const input = "arr: &arr [{}, {}, {}, {}]\ntargets:\n  - <<: *arr\n  - <<: *arr\n";
  for (const path of yamlPaths) {
    const yaml = require(new URL(`../${path}`, import.meta.url).pathname);
    assert.throws(
      () => yaml.load(input, { maxTotalMergeKeys: 5 }),
      /maxTotalMergeKeys/,
      `${path} must reject excessive empty merge sources`
    );
  }
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
