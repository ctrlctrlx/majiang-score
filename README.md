# 川麻胡牌计分网页游戏

## 项目简介

本项目是一个基于 React + Vite 开发的四川麻将（川麻）胡牌计分规则学习与练习网页游戏。用户可以通过交互式练习，快速掌握川麻胡牌后的计分规则，适合麻将爱好者、初学者和教学场景。

## 主要功能
- **计分规则说明**：详细展示川麻常见胡牌类型及计分倍数，支持表格展示。
- **练习区**：随机生成胡牌类型组合，用户输入计算得分，系统自动判分并给出详细算法说明。
- **答题统计**：记录答题总数、正确数和正确率。
- **全平台适配**：支持电脑端和手机端访问，界面美观、交互流畅。
- **易于扩展**：支持自定义新增胡牌类型（如明杠、暗杠等）。

## 技术栈
- [React](https://react.dev/) 18+
- [Vite](https://vitejs.dev/) 4+
- TypeScript
- CSS3（响应式设计）

## 安装与本地运行

1. 克隆项目
   ```bash
   git clone https://github.com/你的用户名/majiang-score.git
   cd majiang-score
   ```
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   ```
4. 浏览器访问 [http://localhost:5173](http://localhost:5173)

## 生产环境打包与本地预览

```bash
npm run build
npm run preview
```

---

## 部署到 Vercel

1. 注册并登录 [Vercel](https://vercel.com/)
2. 关联你的 GitHub 仓库，导入本项目
3. 配置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: 保持空白（除非项目在子文件夹）
4. 一键部署，获得公开访问网址
5. 以后只需 `git push`，Vercel 会自动重新部署

---

## 目录结构

```
majiang-score/
├── public/                # 静态资源
├── src/                   # 源码目录
│   ├── App.tsx            # 主页面与核心逻辑
│   ├── App.css            # 全局样式
│   └── ...                # 其他组件和资源
├── package.json           # 项目依赖与脚本
├── vite.config.ts         # Vite 配置
├── README.md              # 项目说明
└── ...
```

---

## 贡献指南

欢迎提交 Issue 或 Pull Request 参与项目共建：
1. Fork 本仓库
2. 新建分支进行开发
3. 提交 PR 并描述你的修改内容

---

## 许可证

本项目采用 [MIT License](./LICENSE) 开源，欢迎自由使用和二次开发。

---

## 联系方式

如有建议或合作意向，请通过 GitHub Issue 联系。 