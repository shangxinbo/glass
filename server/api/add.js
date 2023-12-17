import query from '../utils/mysql.mjs'
import dayjs from 'dayjs'

export default defineEventHandler(async event => {
  const data = await readBody(event)
  if (data.name || data.tel) {
    // 有手机号或者姓名就行
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const syl =
      'insert into customers ' +
      '(name,tel,lens,frame,righteye,lefteye,distance,price,mark,update_time) value ' +
      `("${data.name || ''}", "${data.tel || ''}","${data.lens || ''}","${
        data.frame || ''
      }","${data.righteye || ''}","${data.lefteye || ''}","${
        data.distance || ''
      }","${data.price || ''}","${data.mark || ''}","${now}")`
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
