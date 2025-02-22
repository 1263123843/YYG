import { useState, useEffect } from 'react'
import './App.css'

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    // 进入页面时发送初始消息
    setMessages([{
      text: '你是谁呀',
      isUser: false
    }])
  }, [])

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      text: inputText,
      isUser: true
    }

    // 根据用户输入生成回复
    const replyMessage: Message = {
      text: inputText.includes('闫亚格') ? '小宝宝，我是你老公' : '我不认识你',
      isUser: false
    }

    setMessages(prev => [...prev, userMessage, replyMessage])
    setInputText('')
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="请输入消息..."
        />
        <button onClick={handleSendMessage}>发送</button>
      </div>
    </div>
  )
}

export default App
