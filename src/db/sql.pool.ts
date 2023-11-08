import mysql from "mysql";

var pool = mysql.createPool({
  multipleStatements: true,
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "canon2003",
  database: "gustodb",
});

export const sqlPool = pool;
