# Glass-Customer-Manager

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

- Build by [Nuxt 3 Minimal Starter](https://nuxt.new/)
- UI depend on [Vant 4](https://vant-ui.github.io/vant/#/zh-CN)
- With [Mysql]() database

## Database

```
-- 导出 glass 的数据库结构
CREATE DATABASE IF NOT EXISTS `glass` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `glass`;

-- 导出  表 glass.customers 结构
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '客户姓名',
  `tel` varchar(100) DEFAULT NULL COMMENT '手机号码',
  `lens` varchar(100) DEFAULT NULL COMMENT '镜片',
  `frame` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '镜框',
  `righteye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '右眼',
  `lefteye` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '左眼',
  `distance` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '瞳距',
  `price` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '价格',
  `mark` varchar(300) DEFAULT NULL COMMENT '备注',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

## Development

- **设置环境变量，包含数据库配置** 程序默认数据库连接用户为`root`
  ubuntu 在 bash 配置文件添加 3 个输出变量语句，windows 直接添加 3 个系统环境变量字段即可
  ```bash
  $vi ~/.bashrc
    export NUXT_ENV_DB_HOST=
    export NUXT_ENV_DB=glass
    export NUXT_ENV_DB_PWD=
  ```
- **安装依赖**
  ```
  npm install
  ```
- **Dev server**
  ```
  npm run dev
  ```
  Start the development server on http://localhost

## Production

```bash
  Ubuntu 20.04.5 LTS
  mysql Ver 8.0.32-0ubuntu0.20.04.2 for Linux on x86_64 ((Ubuntu))
  nvm v0.39.3
  node v18.14.0
  pm2 v5.2.2
```

- **基础配置搭建**

  > 注意 ubuntu 默认登录用户为 ubuntu,而 centos 是 root

  - ubuntu 更新内核和软件包
    ```bash
    apt-get dist-upgrade
    apt-get update
    apt-get upgrade
    ```
  - [install nvm](https://github.com/nvm-sh/nvm)
  - `nvm install 18`
  - `npm install pm2 -g`

- **Mysql8 配置**

  - `sudo apt install mysql-server`
  - 重置 mysql root 登录密码
  - 设置远程登录权限
    ···
    select host, user, plugin from user;
    GRANT ALL ON _._ TO 'root'@'%';
    flush privileges;

- **防火墙规则**
  配置外网防火墙，端口暴露 80,443,3306,3000,22
  example:接受 TCP：3306 源地址 0.0.0.0/0

- **端口映射**
  linux 默认不可使用 1024 以下的端口，node 服务不可在 80 端口上启动
  ```bash
  $ sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
  $ sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000
  $ sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
  $ sudo iptables-save
  ```
- **其他**
  流水线需要解压包，`sudo apt install unzip`
  pm2 开机启动 `pm2 save`

## 自动化集成 https://buddy.works

Buddy 插件轻量容易管理相较于 appveyor 和小老头更适合前端部署，每个月 300 分钟上限部署时间，勉强够用，部署密集期可使用两个账号shangxinbo123@gmail.com/shangxinbo124@gmail.com

Trigger on Event
Git push : branch main

Action1:node bash

```bash
npm install
npm run build
```

Action2: Transfer zip
ARCHIVE FILE : build\_$BUDDY_EXECUTION_ID.zip
IGNORE FILES USING PATHS AND PATTERNS :

```
.git
*.zip
```

Action3: SFTP
SOURCE- Pipeline Filesystem : /build\_$BUDDY_EXECUTION_ID.zip

Action4: SSH remote

```
cd /opt/glass
sudo unzip -ov build_$BUDDY_EXECUTION_ID.zip
pm2 restart glass
pm2 save
rm -f $build_$BUDDY_EXECUTION_ID.zip
```

## 数据清洗

查询以名称手机号价格更新时间为唯一标准的重复数据
SELECT NAME,tel,price,update_time,COUNT(1) FROM customers GROUP BY NAME,tel,update_time,price HAVING COUNT(1)>1

删除
DELETE
FROM
customers  
WHERE
id NOT IN ( SELECT hd.minid FROM ( SELECT MIN( id ) AS minid FROM customers GROUP BY NAME,tel,update_time,price ) hd )

## 其他

node包管理工具 不给超管安装 node 运行环境
root 用户的配置在根目录 /root 下
pm2 startup 开机启动
不需要 node 版本管理工具，使用 nodesource 安装 https://github.com/nodesource/distributions
删除 iptables 防火墙转发规则，与网关冲突
Zmodem transfers

pm2 日志
~/.pm2/logs/ 
命令pm2 logs查看

nginx 日志
cd /var/log/nginx/     tail 查看

