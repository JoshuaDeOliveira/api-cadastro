import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBDATABASE,
    password: process.env.DBPASSWORD, 
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0
})

export async function TesteConexao() {
    try{
        await pool.query(
            `SELECT 1;`
        )
        return true
    } catch (err) {
        if (err.code == 'ECONNREFUSED'){
            console.log(`Não foi possivel estabelecer conexão ao banco!`)
        } else {
            console.log(`Tivemos esse erro relacionado a conexão do banco: ${err}`)
        }
        return false
    }
}

export default pool