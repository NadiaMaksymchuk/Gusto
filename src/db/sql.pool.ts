import mysql from 'mysql';

var pool  = mysql.createPool({
    multipleStatements: true,
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'canon2003',
    database        : 'gustodb'
});

export const query = (text: string, params?: any) => pool.query(text, params);