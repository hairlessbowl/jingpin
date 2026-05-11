# Design Intelligence MVP

竞品反向分析 MVP：上传竞品/我方素材，生成结构化页面拆解、差异分析、融合建议和 Figma 结构报告。

## 本地运行

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

- 前端：`http://localhost:3025`
- 后端：`http://localhost:4000/api/health`

## 线上部署

推荐使用 GitHub 私有仓库 + Render Blueprint。详见 [docs/deploy-render.md](docs/deploy-render.md)。
