// ==================== DOM 元素 ====================
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 透明度控件
const alphaSlider = document.getElementById('alphaSlider');
const alphaValueSpan = document.getElementById('alphaValue');
const resetAlphaBtn = document.getElementById('resetAlphaBtn');

// 背景控件
const changeBgBtn = document.getElementById('changeBgBtn');
const resetBgBtn = document.getElementById('resetBgBtn');
const bodyEl = document.body;

// ==================== 对话历史管理（OpenAI 格式）====================
let conversationHistory = [
    { role: 'system', content: '你是一个友好、智能的助手。' }
];

// 可选：添加一个欢迎消息（仅 UI 显示，不加入历史）
function addWelcomeMessage() {
    if (messagesContainer.children.length === 0) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'message bot';
        welcomeDiv.innerHTML = '<div class="message-content">✨ 你好！<br>📸 点击「背景」可更换图片<br>🔮 拖动「窗口透明」滑块调节透明度<br>💬 我已连接大模型，你可以直接提问～</div>';
        messagesContainer.appendChild(welcomeDiv);
    }
}
addWelcomeMessage();

// ==================== UI 消息显示（不影响历史）====================
function addUserMessage(text) {
    if (!text.trim()) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 机器人消息显示（同时会追加到 conversationHistory，但由后端返回后统一处理）
function addBotMessage(text) {
    if (!text) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 显示/隐藏“正在输入”指示器
let typingIndicator = null;
function showTyping(show) {
    if (show && !typingIndicator) {
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = 'typingIndicator';
        div.innerHTML = '<div class="message-content">🤖 正在思考...</div>';
        messagesContainer.appendChild(div);
        typingIndicator = div;
        scrollToBottom();
    } else if (!show && typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ==================== 调用后端 API ====================
async function sendMessageToAPI(userMessage) {
    // 将用户消息加入历史
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // 显示“正在输入”
    showTyping(true);
    
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        // OpenAI 兼容格式：data.choices[0].message.content
        const assistantMessage = data.choices?.[0]?.message?.content;
        if (!assistantMessage) {
            throw new Error('响应格式错误，未找到机器人回复');
        }
        
        // 将助手回复加入历史
        conversationHistory.push({ role: 'assistant', content: assistantMessage });
        
        // 显示机器人消息
        addBotMessage(assistantMessage);
        
    } catch (error) {
        console.error('请求失败:', error);
        addBotMessage(`❌ 连接大模型失败：${error.message}\n请检查后端服务是否运行（node server.js）以及 API_KEY 是否配置正确。`);
    } finally {
        showTyping(false);
    }
}

// ==================== 发送消息处理 ====================
function handleSendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;
    
    // 清空输入框
    userInput.value = "";
    // 显示用户消息（UI 上立即显示）
    addUserMessage(text);
    // 调用后端 API
    sendMessageToAPI(text);
}

// 绑定事件
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
    }
});

// ==================== 透明度调节（与之前相同）====================
const MSG_BASE_RATIO = 0.7 / 0.92;
const INPUT_BASE_RATIO = 0.85 / 0.92;

function updateTransparency(alpha) {
    alpha = Math.min(1.0, Math.max(0.2, alpha));
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) chatContainer.style.background = `rgba(255, 255, 255, ${alpha})`;
    
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) chatMessages.style.background = `rgba(249, 249, 249, ${alpha * MSG_BASE_RATIO})`;
    
    const inputArea = document.querySelector('.chat-input-area');
    if (inputArea) inputArea.style.background = `rgba(255, 255, 255, ${alpha * INPUT_BASE_RATIO})`;
    
    const botAlpha = Math.min(0.92, Math.max(0.65, alpha * 0.9));
    let style = document.getElementById('dynamic-bot-alpha');
    if (!style) {
        style = document.createElement('style');
        style.id = 'dynamic-bot-alpha';
        document.head.appendChild(style);
    }
    style.textContent = `.bot .message-content { background: rgba(255, 255, 255, ${botAlpha}); }`;
}

function handleAlphaChange(value) {
    const alpha = parseFloat(value);
    updateTransparency(alpha);
    alphaValueSpan.textContent = Math.round(alpha * 100) + '%';
    localStorage.setItem('chatAlpha', alpha);
}

alphaSlider.addEventListener('input', (e) => handleAlphaChange(e.target.value));
resetAlphaBtn.addEventListener('click', () => {
    alphaSlider.value = '0.92';
    handleAlphaChange(0.92);
    showToast('透明度已恢复默认');
});

const savedAlpha = localStorage.getItem('chatAlpha');
if (savedAlpha && !isNaN(parseFloat(savedAlpha))) {
    alphaSlider.value = savedAlpha;
    handleAlphaChange(savedAlpha);
} else {
    handleAlphaChange(0.92);
}

// ==================== 背景图片切换 ====================
let bgFileInput = null;
function createFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    return input;
}
bgFileInput = createFileInput();

function changeBackgroundWithImage(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('请选择有效的图片文件');
        return;
    }
    if (file.size > 12 * 1024 * 1024) {
        alert('图片超过12MB，请选择小一点的文件');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        bodyEl.style.background = `url("${e.target.result}") center center / cover no-repeat fixed`;
        showToast('✨ 背景已更换');
    };
    reader.readAsDataURL(file);
}

bgFileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) changeBackgroundWithImage(e.target.files[0]);
    bgFileInput.value = '';
});

changeBgBtn.addEventListener('click', () => bgFileInput.click());
resetBgBtn.addEventListener('click', () => {
    bodyEl.style.background = '';
    bodyEl.style.backgroundImage = '';
    showToast('🌈 已恢复默认渐变背景');
});

function showToast(msg, duration = 1800) {
    let toast = document.querySelector('.custom-toast-temp');
    if (toast) toast.remove();
    toast = document.createElement('div');
    toast.className = 'bg-reset-toast custom-toast-temp';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// 自动滚动到底部（使用 MutationObserver）
const observer = new MutationObserver(() => scrollToBottom());
observer.observe(messagesContainer, { childList: true, subtree: false });

console.log('✅ 前端已启动，后端地址：http://localhost:3000');