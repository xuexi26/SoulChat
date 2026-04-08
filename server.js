const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;   // 用于读取人格文件
const path = require('path');         // 用于处理文件路径

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 配置
const API_KEY = 'not-needed';  // 你的密钥
const API_URL = 'http://127.0.0.1:1234/v1/chat/completions';  // OpenAI兼容接口

// ==================== 新增：构建人格 System Prompt 的函数 ====================
async function buildSystemPrompt() {
    try {
        // 读取三个人格定义文件（假设它们放在 persona/ 文件夹下）
        const soul = await fs.readFile(path.join(__dirname, 'persona', 'SOUL.md'), 'utf-8');
        const agents = await fs.readFile(path.join(__dirname, 'persona', 'AGENTS.md'), 'utf-8');
        const user = await fs.readFile(path.join(__dirname, 'persona', 'USER.md'), 'utf-8');
        
        return `你是一个由用户定义的AI助手。请严格遵循以下“灵魂”定义来思考和回复：

${soul}

${agents}

关于用户：
${user}
`;
    } catch (error) {
        console.error("读取人格文件失败，使用默认提示:", error.message);
        // 如果文件不存在，返回一个默认的 System Prompt
        return "你是一个友好、乐于助人的AI助手。";
    }
}
// =========================================================================

// 代理接口
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // ========== 新增：构建包含人格的 System Prompt ==========
    const systemPrompt = await buildSystemPrompt();
    // 将 System Prompt 添加到 messages 数组的开头
    const messagesWithPersona = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];
    // ====================================================
    
    console.log('发送请求到:', API_URL);
    console.log('消息内容:', messagesWithPersona);

    // 魔搭社区要求的请求格式（OpenAI兼容格式）
    const requestBody = {
      model: 'Qwen/Qwen3-8B',  // 你部署的模型名称
      messages: messagesWithPersona,  // 关键改动：使用注入人格后的消息数组
      stream: false,
      max_tokens: 1024,
      temperature: 0.7
    };

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000  // 设置120秒超时
    });

    console.log('收到响应:', response.data);

    // 直接返回OpenAI格式的响应
    res.json(response.data);
    
  } catch (error) {
    console.error('错误详情:', error.response?.data || error.message);
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应头:', error.response.headers);
      console.error('响应数据:', error.response.data);
    }
    
    // 返回友好的错误信息
    res.status(error.response?.status || 500).json({ 
      error: '调用大模型失败', 
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
});