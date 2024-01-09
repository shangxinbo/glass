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
    connection.end()
    return rows
  } catch (e) {
    console.log(e) // 数据库执行失败
    return []
  }
}

export default query
