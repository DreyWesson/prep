import * as fsDatabase from "../controllers/fs/index.fs.controllers.js";
import * as nosqlDatabase from "../controllers/nosql/index.nosql.controllers.js";
import * as sqlDatabase from "../controllers/sql/index.sql.controllers.js";

export const selectDB = (db) => {
  const dbList = {
    fs: fsDatabase,
    sql: sqlDatabase,
    nosql: nosqlDatabase,
  };
  return dbList[db];
}
