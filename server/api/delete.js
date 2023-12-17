import query from '../utils/mysql.mjs'

export default defineEventHandler(async event => {
  const data = await readBody(event)
  if (data.id) {
    const syl = `delete from customers where id=${data.id}`
    const result = await query(syl)
    if (result.affectedRows > 0) {
      return { code: 0 }
    } else {
      return { code: -1 }
    }
  } else {
    return { code: -1 }
  }
})
