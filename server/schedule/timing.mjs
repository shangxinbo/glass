// 定时任务

import dayjs from 'dayjs'
import nodemailer from 'nodemailer'
import query from '../utils/mysql.mjs'
import { CronJob } from 'cron'
import emailConfig from '../../email.config.mjs'

const now = dayjs()

const month = now.month()

let lastMonth = month - 1 >= 0 ? month - 1 : 11
let lastYear = now.year()
if (lastMonth == 11) lastYear -= 1

const lastTime = dayjs().set('year', lastYear).set('month', lastMonth)

const start_time = lastTime.startOf('month').format('YYYY-MM-DD HH:mm:ss')
const end_time = lastTime.endOf('month').format('YYYY-MM-DD HH:mm:ss')

const syl =
  'select * from  customers where ' +
  `update_time>'${start_time}' and update_time<'${end_time}' limit 1000`
const result = await query(syl)

let mailbody =
  '<tr style="border-bottom:1px solid gray">' +
  '<th width="100">姓名</th>' +
  '<th width="150">电话</th>' +
  '<th width="100">消费价格</th>' +
  '<th width="250">时间</th></tr>'
let sum = 0
let unsum = 0

for (let i = 0; i < result.length; i++) {
  const price = Number.parseFloat(result[i]['price'])
  if (isNaN(price)) {
    unsum = 1
  } else {
    sum = sum + Number(price.toFixed(2))
  }

  mailbody += `<tr style="border-bottom:1px solid gray">
                <td>${result[i]['name']}</td>
                <td>${result[i]['tel']}</td>
                <td>${result[i]['price']}</td>
                <td>${dayjs(result[i]['update_time']).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}</td>
              </tr>`
}

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: true,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass //stmp 授权码，qq邮箱设置中获取
  }
})

async function main () {
  await transporter.sendMail({
    from: emailConfig.user,
    to: emailConfig.to,
    subject: `眼镜店${lastYear}年${lastMonth + 1}月进展汇总`,
    html: `
    <div><strong>${lastYear}年${lastMonth + 1}月新增记录：</strong>${
      result.length
    }条</div>
    <div><strong>${lastYear}年${
      lastMonth + 1
    }月销售总金额：</strong>${sum}元</div>
    <div>数据信息表</div>
    <table style="text-align:center; border-collapse: collapse;">${mailbody}<table>
    `
  })
}

const job = new CronJob(
  '10 00 1 * *', // https://crontab.guru/
  // '* * * * *',
  function () {
    main().catch(console.error)
  },
  null, // onComplete
  true // start
)
