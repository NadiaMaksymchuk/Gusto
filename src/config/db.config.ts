import mysql from 'mysql'
//local mysql db connection
const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'canon2003',
  database: 'gustodb',
})
dbConn.connect(function (err) {
  if (err) throw err
  console.log('Database Connected!')
})
export { dbConn }
