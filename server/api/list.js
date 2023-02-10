import query from '../utils/mysql.js'

export default defineEventHandler(async event => {
  // http协议解析框架h3
  // https://github.com/unjs/h3
  // https://www.jsdocs.io/package/h3
  const params = getQuery(event)
  const page = params.page || 1
  const pageSize = params.pageSize || 50
  const keyword = params.keyword || ''
  const condition = keyword
    ? `where name like '%${keyword}%' or tel like '%${keyword}%'`
    : ''
  const syl = `select * from customers ${condition} order by update_time desc limit ${
    (page - 1) * pageSize
  }, ${pageSize}`
  const result = await query(syl)
  return { code: 0, data: result }
})
