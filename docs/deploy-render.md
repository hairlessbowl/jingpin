# Render 部署说明

## 1. 推到 GitHub 私有仓库

```bash
git init
git add .
git commit -m "Implement real MVP backend"
git branch -M main
git remote add origin git@github.com:<your-org>/<your-private-repo>.git
git push -u origin main
```

如果本机 `git` 报 Xcode Command Line Tools 错误，先在终端执行：

```bash
xcode-select --install
```

## 2. Render 创建服务

1. 在 Render 新建 Blueprint，选择这个 GitHub 私有仓库。
2. Render 会读取根目录 `render.yaml`。
3. 首次部署会自动创建 Web Service 和 Postgres。
4. 启动命令会先执行 `npm run db:migrate`，再执行 `npm run start`。

## 3. 本地开发

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

前端地址：`http://localhost:3025`

后端健康检查：`http://localhost:4000/api/health`

## 4. 演示前检查

- 上传 1 张竞品截图和 1 张我方截图。
- 提交分析后进入结果页。
- 刷新页面后报告仍可打开。
- 进入历史任务页，确认新任务存在。
- 换一台电脑打开 Render URL，确认任务数据仍在。
