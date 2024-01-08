module.exports = {
  apps: [
    {
      name: 'glass',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      log_date_format:'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'cron',
      script: './server/schedule/timing.mjs',
      log_date_format:'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
