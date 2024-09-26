import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

export async function testFile(data) {
  const { name, metadata, cover, buffer } = data;
  console.log("🚀 ~ file: test.ts:7 ~ buffer:", buffer);
  const dest = path.join(app.getPath("documents"), "BookWise Library 2");
  const fileDest = path.join(dest, name);
  console.log("🚀 ~ file: test.ts:8 ~ dest:", dest);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  fs.writeFileSync(fileDest, Buffer.from(buffer));
  // fs.fs.readFile(data.file).then((buf) => {
  //   console.log("🚀 ~ file: main.ts:83 ~ buf:", buf);
  // });
}
