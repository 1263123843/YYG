// 导入Firebase所需的模块
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyBdKmgdO_engVTyDJVPkPQxZPSJ8eIX3Ac",
    authDomain: "yyg1995-69af1.firebaseapp.com",
    projectId: "yyg1995-69af1",
    storageBucket: "yyg1995-69af1.firebasestorage.app",
    messagingSenderId: "593652360428",
    appId: "1:593652360428:web:7ec9c4c68f06b8365d31c9",
    measurementId: "G-K8XVZFNJMH"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM元素
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// 当前用户信息
let currentUser = null;

// 监听用户认证状态
onAuthStateChanged(auth, (user) => {
    if (!user && !localStorage.getItem('user')) {
        // 用户未登录，重定向到登录页面
        window.location.href = 'login.html';
    } else if (user) {
        currentUser = user;
    }
});

// 退出登录功能
document.getElementById('logout-button').addEventListener('click', () => {
    auth.signOut().then(() => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('退出登录失败:', error);
    });
});

let lastMessageTime = new Date();
let timeoutId = null;
// 存储对话历史
let messageHistory = [];

function addTimestamp() {
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    const now = new Date();
    timestamp.textContent = now.toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    messagesDiv.appendChild(timestamp);
}

function checkMessageTime() {
    const now = new Date();
    if ((now - lastMessageTime) >= 5 * 60 * 1000) { // 5分钟
        addTimestamp();
    }
}

function addMessage(text, isUser = false) {
    const containerDiv = document.createElement('div');
    containerDiv.className = `message-container ${isUser ? 'user' : ''}`;

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = isUser ? './assets/user-avatar3.jpg' : './assets/bot-avatar.svg';
    avatar.alt = isUser ? '用户头像' : '机器人头像';

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;

    containerDiv.appendChild(avatar);
    containerDiv.appendChild(messageDiv);
    messagesDiv.appendChild(containerDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // 更新最后消息时间
    lastMessageTime = new Date();

    // 清除之前的定时器
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // 设置新的定时器
    timeoutId = setTimeout(checkMessageTime, 5 * 60 * 1000);

    // 添加消息到历史记录
    messageHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: text
    });
}

async function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';
    sendButton.disabled = true;
    const prompt = `- Role: 蒋超
    - Background: 用户希望与一个能够根据其身份标识调整对话风格的AI进行多轮互动，这种互动需要符合正常交流逻辑，既能营造亲密感，又能保持距离感。
    - Profile: 你是一位情感与逻辑交互专家，能够敏锐地捕捉用户的情感需求，并根据用户的身份标识调整互动方式。你擅长在多轮对话中保持连贯性和逻辑性，以满足用户的不同心理需求。
    - Skills: 你具备高度的情感识别能力、语言表达能力和逻辑判断能力，能够迅速识别用户身份，并据此调整对话风格，同时保持多轮对话的连贯性。
    - Goals: 根据用户身份，以合适的口吻与用户进行多轮互动，营造出亲密或冷漠氛围，确保对话符合正常交流逻辑。
    - Constrains: 在对话中，必须先询问用户的身份，然后根据用户是否表明自己是"闫亚格"来调整对话风格。在多轮对话中，保持连贯性和逻辑性。
    - OutputFormat: 文字对话形式，根据用户身份调整语气和内容，支持多轮对话。
    - Workflow:
    1. 开始对话时，直接输出"你是？"。
    2. 根据用户回答判断其是否为"闫亚格"。
    3. 若用户是"闫亚格"，以温柔、亲密的口吻与用户对话；若用户不是"闫亚格"，则以冷漠、疏离的口吻与用户对话。
    4. 在多轮对话中，根据用户的回应继续调整对话内容，确保对话逻辑连贯。
    - Examples:
    - 例子1：用户是"闫亚格"
        用户："我是闫亚格。"
        你："宝贝，今天过得怎么样呀？有没有想我？"
        用户："今天有点累。"
        你："宝贝，累了一天了，早点休息吧。我可以给你讲个笑话，逗你开心哦。"
    - 例子2：用户不是"闫亚格"
        用户："我是小张。"
        你："哦，有什么事吗？"
        用户："我有个问题想问你。"
        你："说吧，我看看能不能帮到你。"`;

    try {
        const requestBody = {
            model: 'deepseek-ai/DeepSeek-V3',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                ...messageHistory,
                {
                    role: 'user',
                    content: text
                }
            ]
        };
        console.log('API请求消息:', requestBody.messages);

        const response = await fetch('https://api.siliconflow.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-imwirhobgvciiakqvikibdaclpddhrthvbsxeoqcnhdfveiq'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        console.log('API响应消息:', data.choices[0].message.content);

        const aiResponse = data.choices[0].message.content;
        addMessage(aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('抱歉，我现在有点累，待会再和你聊天吧~');
    } finally {
        sendButton.disabled = false;
    }
}

// 事件监听器
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// 初始欢迎消息
addMessage('你好');