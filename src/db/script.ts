import * as mysql from 'mysql2'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

export function createDbIfDontExist() {
  const absolutePath = path.resolve(__dirname, 'database.sql')

  const pool = mysql.createConnection({
    host: 'gusto-db-1',
    user: 'root',
    password: 'canon2003',
    database: 'gustodb',
    port: 3306,
  })

  const fileStream = fs.createReadStream(absolutePath)

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  rl.on('line', (sqlQuery: string) => {
    pool.query(sqlQuery, (err) => {
      if (err) throw err
      console.log('Script executed successfully')
    })
  })
}
