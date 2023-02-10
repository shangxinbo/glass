# Glass-Customer-Manager

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

- Build by [Nuxt 3 Minimal Starter](https://nuxt.new/)
- UI depend on [Vant 4](https://vant-ui.github.io/vant/#/zh-CN)
- With [Mysql]() database

## Database

mysql 数据表 customers

```
CREATE TABLE `customers` (
	`id` BIGINT(19) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NULL DEFAULT NULL COMMENT '客户姓名' COLLATE 'utf8_general_ci',
	`tel` VARCHAR(100) NULL DEFAULT NULL COMMENT '手机号码' COLLATE 'utf8_general_ci',
	`lens` VARCHAR(100) NULL DEFAULT NULL COMMENT '镜片' COLLATE 'utf8_general_ci',
	`frame` VARCHAR(100) NULL DEFAULT NULL COMMENT '镜框' COLLATE 'utf8_general_ci',
	`righteye` VARCHAR(100) NULL DEFAULT NULL COMMENT '右眼' COLLATE 'utf8_general_ci',
	`lefteye` VARCHAR(100) NULL DEFAULT NULL COMMENT '左眼' COLLATE 'utf8_general_ci',
	`distance` VARCHAR(100) NULL DEFAULT NULL COMMENT '瞳距' COLLATE 'utf8_general_ci',
	`price` VARCHAR(100) NULL DEFAULT NULL COMMENT '价格' COLLATE 'utf8_general_ci',
	`mark` VARCHAR(300) NULL DEFAULT NULL COMMENT '备注' COLLATE 'utf8_general_ci',
	`update_time` DATETIME NULL DEFAULT NULL COMMENT '更新时间',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=85983
;
```

数据库连接参数,其中用户名默认`root`，其他链接参数需要种到系统环境变量中

```
const connection = await mysql.createConnection({
  host: process.env.NUXT_ENV_DB_HOST,
  user: 'root',
  database: process.env.NUXT_ENV_DB,
  password: process.env.NUXT_ENV_DB_PWD
})
```

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Using `PM2`

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## TODO 
* 数据清洗
* 增加删除管理
* 增加插入时间字段
* 增加图表展示
* 数据定时备份
* 倒叙处理
