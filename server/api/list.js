import query from '../utils/mysql.mjs'

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
  // 按id排序可以保证倒叙，避免脏数据
  const syl = `select * from customers ${condition} order by id desc limit ${
    (page - 1) * pageSize
  }, ${pageSize}`
  const result = await query(syl)
  return { code: 0, data: result }
})
