# book-library-manage

图书借阅系统（后台管理），技术栈：**Express + MySQL**，前端页面由 Express 静态托管（jQuery 做表单校验）。

## 功能

- 图书列表：默认按入库时间降序、隔行变色、每页 5 条分页、按名称模糊查询（记忆查询条件）
- 查看图书详细信息（只读）
- 新增图书（必填项 jQuery 校验，入库时间/入库人/是否借阅带默认值）
- 修改图书（入库人、入库时间只读）
- 删除图书（确认提示 + 结果提示）

## 目录结构

```
server/            Express 服务端（REST API）
public/            前端页面（静态托管）
sql/schema.sql     建库建表 + 主键自增 + 测试数据
test/              回归测试（node:test）
.github/workflows/ GitHub Actions 回归测试
```

## 本地运行

1. 准备 MySQL，复制 `.env.example` 为 `.env` 并填写连接信息。
2. 初始化数据库：`npm run db:init`（或直接 `mysql -uroot -p < sql/schema.sql`）。
3. 安装依赖：`npm install`
4. 启动：`npm start`，访问 http://localhost:3000

## 测试

`npm test`（需要可用的 MySQL，连接信息取自环境变量 / `.env`）。

## CI

推送 / PR 到 `main` 时，GitHub Actions 会拉起 MySQL 服务容器、导入 `sql/schema.sql` 并执行 `npm test` 做回归。
