import mysql from 'mysql2/promise'

async function query (str) {
  const connection = await mysql.createConnection({
    host: process.env.NUXT_ENV_DB_HOST,
    user: 'root',
    database: process.env.NUXT_ENV_DB,
    password: process.env.NUXT_ENV_DB_PWD
  })
  try {
    const [rows] = await connection.execute(str)
    return rows
  } catch (e) {
    return []
  }
}

export default query