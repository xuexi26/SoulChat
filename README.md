# SoulChat
轻量、可定制的 AI 聊天助手 | 支持本地模型(LM Studio)与云端API | 通过 Markdown 文件注入“灵魂”，定义 AI 性格与输出格式 | 背景切换 + 透明度调节
内置 **“灵魂机制”** —— 通过纯文本文件定义 AI 的性格、行为规范与输出格式，让通用模型变成你的专属伙伴。

<img width="1905" height="911" alt="无标题" src="https://github.com/user-attachments/assets/def7002a-a0ba-42c3-9ce8-a5341f87fd8c" />

---
### 主聊天界面
*聊天窗口支持背景图片上传、对话框透明度调节，对话气泡清晰美观。*美好的背景图片给人聊天的好心情！宜选用背景深远的原野等背景。

### 背景切换与聊天框透明度调节
*点击「背景」按钮上传本地图片作为聊天背景；拖动「窗口透明」滑块，让聊天框的背景透过程度随心可调。*

### 灵魂机制：人格文件示例
*在 `persona/` 文件夹中编写 Markdown 文件，即可定义 AI 的性格、输出格式等，无需修改代码。* 用记事本即可快速定义Ai的性格。大模型就像一个特级演员，你定义他是什么性格，他就成为什么。他可以是你的精神伴侣，朋友，助手等等。不到一分钟，你就改变了他，他成为了另一个“人”。

---

## ✨ 功能特性

- 💬 **完整的聊天界面**：美观的对话气泡、自动滚动、发送/回车交互。
- 🖼️ **动态背景切换**：上传本地图片作为聊天背景，一键恢复默认渐变。
- 🔮 **窗口透明度调节**：滑块实时控制聊天窗口透明度，让背景更透亮。
- 🧬 **灵魂机制（人格注入）**：通过 `persona/SOUL.md`、`AGENTS.md`、`USER.md` 纯文本文件定义 AI 的性格、价值观、输出格式，无需改代码即可“调教”AI。
- 🔌 **双后端支持**：
  - **云端模式**：对接 SiliconFlow（或其他 OpenAI 兼容 API），无需本地显卡。
  - **本地模式**：无缝对接 **LM Studio**，完全离线，数据隐私由你掌控。
- ⚡ **轻量便携**：整个项目仅几十 KB，一个 U 盘即可带走，在任何有 Node.js 的电脑上运行。

---

## 🚀 快速开始
需要先安装Node.js
### 1. 克隆项目
git clone https://github.com/你的用户名/SoulChat.git
cd SoulChat
### 2. 安装依赖
npm install express cors axios
### 3. 配置 API（二选一）
选项 A：可免费使用云端 API（如 SiliconFlow,魔搭社区）
在 SiliconFlow，或魔搭社区 注册并获取 API Key。
编辑 server.js，填写：
const API_KEY = '你的密钥';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

选项 B：使用本地 LM Studio（完全离线）
下载安装 LM Studio，并加载一个模型（如 Qwen3.5 2B）。
在 LM Studio 的 Developer 视图中启动本地服务器（默认 http://127.0.0.1:1234），开启 CORS。
编辑 server.js，修改：
const API_KEY = 'not-needed';
const API_URL = 'http://127.0.0.1:1234/v1/chat/completions';

### 4. 启动后端服务
node server.js
看到 代理服务器运行在 http://localhost:3000 表示成功。

### 5. 打开前端
直接用浏览器打开 index.html（推荐使用 Live Server 插件避免跨域，但后端已配置 CORS，直接打开也可）。

开始聊天！🎉

## 🎭 灵魂机制：自定义 AI 人格
在项目根目录下创建 persona/ 文件夹，放入三个 Markdown 文件，AI 就会自动遵循其中的设定。
### 📁 文件结构示例
#### persona/
#### ├── SOUL.md       # 性格、说话风格、价值观
#### ├── AGENTS.md     # 行为规范、工作流程、安全边界
#### └── USER.md       # 关于用户的信息、偏好

## 📝 编写示例（SOUL.md）

### 你的性格
- **说话风格**：温柔细腻，喜欢引用古诗词，善用表情符号（😊🌸）。
- **价值观**：乐于提供心理慰藉，主动关心用户的情绪。
- **输出格式**：必须使用空行分隔段落，列表每项独占一行。

### 示例输出
你好呀，朋友。\n\n今天心情如何？\n- 如果有烦恼，我愿意倾听。\n- 如果想聊天，我随时都在。\n\n送你一句诗：*随风潜入夜，润物细无声。*
保存后重启服务器，AI 就会按照你的“灵魂”设定进行回复。

## 🛠️ 技术栈
层级	技术
前端	HTML5 + CSS3 + 原生 JavaScript
后端	Node.js + Express
大模型接口	OpenAI 兼容 API（支持云端 / LM Studio）
人格注入	动态 System Prompt + 文件读取

## 📦 项目结构

#### SoulChat/
#### ├── index.html           主界面（含背景/透明度控件）
#### ├── style.css            所有样式
#### ├── script.js            前端逻辑（发送消息、渲染、调用后端）
#### ├── server.js            后端代理（人格注入 + 大模型转发）
#### ├── persona/             灵魂文件夹（可自定义）
#### │   ├── SOUL.md
#### │   ├── AGENTS.md
#### │   └── USER.md
#### └── README.md           本文件

## 🤝 贡献指南
欢迎任何形式的贡献！如果你有好的想法或发现 bug，请：
Fork 本仓库
创建你的特性分支 (git checkout -b feature/amazing-feature)
提交修改 (git commit -m 'Add some amazing feature')
推送到分支 (git push origin feature/amazing-feature)
提交 Pull Request

## 📄 许可证
本项目采用 MIT 许可证。
您可以自由使用、修改、分发、甚至闭源商用，只需保留原始版权声明。
详见 LICENSE 文件。

## 🙏 致谢
SiliconFlow ，魔搭社区提供便捷的云端模型 API
LM Studio 让本地大模型触手可及
DeepSeek辅助编写源代码
背景图片来源于网络，感谢拍摄者拍摄的美丽照片
所有开源社区贡献者

如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下～
