import { drizzleDB, pgDB, schema } from "@/db";
import { DataSource, UploadFileBody } from "./type";

export class PGLiteDataSource implements DataSource {
  async uploadFile(body: UploadFileBody) {
    console.log("🚀 ~ PGLiteDataSource ~ uploadFile ~ body:", body);
    await window.electronAPI?.uploadFile(body);

    window.electronAPI.onUploadFile(async (event, args) => {
      console.log(
        "🚀3333 ~ file: listener.ts:4 ~ window.electronAPI.onUploadFile ~ args:",
        args
      );
      await pgDB.exec(`
  CREATE TABLE IF NOT EXISTS todo (
    id SERIAL PRIMARY KEY,
    task TEXT,
    done BOOLEAN DEFAULT false
  );
  INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
  INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
  INSERT INTO todo (task, done) VALUES ('Create a table', true);
  INSERT INTO todo (task, done) VALUES ('Insert some data', true);
  INSERT INTO todo (task) VALUES ('Update a task');
`);
    });
    const ret = await pgDB.query(`
  SELECT * from todo WHERE id = 1;
`);
    console.log(ret.rows);
  }
}
