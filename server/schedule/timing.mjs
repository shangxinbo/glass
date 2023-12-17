// 定时任务

import dayjs from 'dayjs'

import query from '../utils/mysql.mjs'
const now = dayjs()

const start_time = now.startOf('month').format('YYYY-MM-DD HH:mm:ss')
const end_time = now.endOf('month').format('YYYY-MM-DD HH:mm:ss')

console.log(start_time, end_time)

const syl =
  'select * from  customers where ' +
  `update_time>'${start_time}' and update_time<'${end_time}' limit 1000`
const result = await query(syl)

console.log(syl)
