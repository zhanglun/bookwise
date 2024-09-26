import fs from "node:fs/promises";

export function testFile(data) {
  fs.readFile(data.file).then((buf) => {
    console.log("🚀 ~ file: main.ts:83 ~ buf:", buf);
  });
}
