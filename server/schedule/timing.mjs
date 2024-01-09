// 定时任务

import dayjs from 'dayjs'
import nodemailer from 'nodemailer'
import query from '../utils/mysql.mjs'
import { CronJob } from 'cron'
import emailConfig from '../../email.config.mjs'
import { spawn } from 'child_process'

let mailbody =
  '<tr style="border-bottom:1px solid gray">' +
  '<th width="100">姓名</th>' +
  '<th width="150">电话</th>' +
  '<th width="100">消费价格</th>' +
  '<th width="250">时间</th></tr>'

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
  const now = dayjs()
  const month = now.month()

  let lastMonth = month - 1 >= 0 ? month - 1 : 11
  let lastYear = now.year()
  if (lastMonth == 11) lastYear -= 1

  const lastTime = dayjs().set('year', lastYear).set('month', lastMonth)

  const start_time = lastTime.startOf('month').format('YYYY-MM-DD HH:mm:ss')
  const end_time = lastTime.endOf('month').format('YYYY-MM-DD HH:mm:ss')

  let sum = 0
  let unsum = 0

  const syl =
    'select * from  customers where ' +
    `update_time>'${start_time}' and update_time<'${end_time}' limit 1000`
  const result = await query(syl)

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

// 每个月1号发送汇总数据邮件
new CronJob(
  '10 00 1 * *', // https://crontab.guru/
  // '* * * * *',
  function () {
    main().catch(console.error)
  },
  null, // onComplete
  true // start
)

// 每3天备份一下数据库
new CronJob(
  '0 4 1/3 * *', // At 04:00 on every 3rd day-of-month from 1 through 31.
  function () {
    const dump = spawn('mysqldump', [
      '-u',
      'root',
      `-p${process.env.NUXT_ENV_DB_PWD}`,
      process.env.NUXT_ENV_DB
    ])
    let data = ''
    dump.stdout.on('data', chunk => {
      data = data + chunk
    })
    dump.stdout.on('end', () => {
      transporter.sendMail({
        from: emailConfig.user,
        to: 'shangxinbo116@163.com',
        subject: '眼镜店数据库备份',
        attachments: [
          {
            filename: `glass-${Math.round(Date.now() / 1000)}.sql`,
            content: data
          }
        ]
      })
    })
  },
  null, // onComplete
  true // start
)
