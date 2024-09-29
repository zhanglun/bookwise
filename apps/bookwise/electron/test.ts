import { app } from "electron";
import path from "node:path";
import fs from "node:fs";
import AdmZip from "adm-zip";

function parseCover(
  cover: string,
  bf: Buffer
): [buf: Buffer | null, str: string | null] {
  const zip = new AdmZip(bf);
  const zipEntries = zip.getEntries();
  const a = zipEntries
    .filter((entry) => {
      const { entryName } = entry;
      const coverPathWithoutSlash = cover.replace(/^\//, "");

      return entryName.endsWith(coverPathWithoutSlash);
    })
    .map((entry) => entry.getData())[0];

  return [a, a?.toString("base64")];
}

export async function testFile(data) {
  const { name, metadata, cover, buffer } = data;
  console.log("🚀 ~ file: test.ts:7 ~ buffer:", buffer);
  const dest = path.join(
    app.getPath("documents"),
    "BookWise Library 2",
    metadata.title
  );
  const fileDest = path.join(dest, name);
  console.log("🚀 ~ file: test.ts:8 ~ dest:", dest);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  fs.writeFileSync(fileDest, Buffer.from(buffer));
  const bookModel = { ...metadata, path: fileDest };
  console.log("🚀3333 ~ file: test.ts:42 ~ testFile ~ bookModel:", bookModel);
  const [coverBuf] = parseCover(cover, Buffer.from(buffer));
  console.log("🚀3333 ~ file: test.ts:42 ~ testFile ~ coverBuf:", coverBuf);

  coverBuf && fs.writeFileSync(path.join(dest, "cover.jpg"), coverBuf);

  // fs.fs.readFile(data.file).then((buf) => {
  //   console.log("🚀 ~ file: main.ts:83 ~ buf:", buf);
  // });
  return {
    model: bookModel,
  };
}
