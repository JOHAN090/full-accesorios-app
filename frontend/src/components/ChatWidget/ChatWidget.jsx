import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineChat, HiOutlineX, HiOutlinePaperAirplane } from 'react-icons/hi';
import aiService from '../../services/aiService';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy tu asistente de FULL Accesorios. ¿En qué te puedo ayudar hoy? 🤖', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(userMsg);
      setMessages(prev => [...prev, { text: response.data.reply, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Lo siento, tuve un problema al conectarme. ¿Puedes intentar de nuevo?', isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-header-title">Asistente IA</span>
              <span className="chat-header-status">En línea</span>
            </div>
            <button className="chat-close-btn" onClick={toggleChat}>
              <HiOutlineX />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message-wrapper ${msg.isUser ? 'user' : 'bot'}`}>
                {!msg.isUser && <div className="chat-avatar">🤖</div>}
                <div className={`chat-bubble ${msg.isUser ? 'user-bubble' : 'bot-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message-wrapper bot">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble bot-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <HiOutlinePaperAirplane className="send-icon" />
            </button>
          </form>
        </div>
      )}

      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? <HiOutlineX /> : <HiOutlineChat />}
      </button>
    </div>
  );
};

export default ChatWidget;
