# Vercel 前端项目部署详细流程指南

## 一、准备工作

1. **注册 GitHub 账号**
   - 打开 https://github.com/ 注册并登录。
2. **注册 Vercel 账号**
   - 打开 https://vercel.com/，用 GitHub 账号一键注册并授权。

---

## 二、上传项目到 GitHub

1. **本地初始化 git 仓库**
   ```bash
   git init
   git add .
   git commit -m "init"
   ```
2. **在 GitHub 新建仓库**
   - 登录 GitHub，点击右上角“+” → “New repository”
   - 仓库名如：`majiang-score`，点击“Create repository”
3. **推送本地代码到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/majiang-score.git
   git branch -M main
   git push -u origin main
   ```
   > 如果提示 remote 已存在，先执行 `git remote remove origin` 再添加。

---

## 三、Vercel 部署

1. **登录 Vercel 官网**
   - 打开 https://vercel.com/dashboard
2. **新建项目**
   - 点击 “Add New” → “Project”
   - 选择你的 GitHub 账号，找到并选择你的仓库（如 majiang-score）
3. **配置部署参数**
   - **Project Name**：保持默认或自定义
   - **Framework Preset**：选择 `Vite`（或你的前端框架）
   - **Root Directory**：保持空白（除非你的项目在子文件夹）
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
4. **点击“Deploy”或“创建”**
   - 等待几分钟，Vercel 会自动拉取代码、安装依赖、构建并部署
5. **部署完成**
   - 成功后会显示 Congratulations 页面，并给出你的访问网址（如 `https://majiang-score.vercel.app`）

---

## 四、后续更新

- 本地修改代码后，执行：
  ```bash
  git add .
  git commit -m "更新说明"
  git push
  ```
- Vercel 会自动重新部署，无需手动操作。

---

## 五、常见问题与解决

1. **404 页面/打不开**
   - 检查仓库根目录下是否有 `package.json`、`vite.config.js`、`src` 等项目文件。
   - Vercel 配置的 Root Directory 应为空。
   - Build Command 填 `npm run build`，Output Directory 填 `dist`。
2. **项目结构嵌套**
   - 项目文件必须在仓库根目录，不能多一层文件夹。
3. **国内手机端打不开**
   - Vercel 在中国大陆部分地区访问不稳定，建议用同一WiFi或更换 DNS。
   - 如需国内稳定访问，建议部署到阿里云、腾讯云、又拍云、Gitee Pages 等国内平台。

---

## 六、参考网址
- Vercel 官网：https://vercel.com/
- GitHub 官网：https://github.com/
- 示例部署网址：https://majiang-score-lime.vercel.app/

---

如有问题，可随时联系开发者或查阅 Vercel 官方文档。 