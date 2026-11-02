import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Send,
  User,
  Sparkles,
  HelpCircle,
  Briefcase,
  Compass,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Which internship is best for my skills?",
  "What skills should I learn next?",
  "Which upcoming hackathons can I participate in?",
  "How can I improve my resume?",
  "How do I prepare for a technical interview?",
  "Which free courses should I follow?"
];

export const CareerAssistantPage = () => {
  const { profile, user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile?.full_name || user?.name || 'there'}! 👋 I am your CareerBridge AI Assistant.\n\nI have access to your verified student profile, current technical skills, and all active jobs and hackathons in the platform database. How can I help accelerate your career readiness today?`,
      source: 'CareerBridge Assistant',
      suggested_actions: ["Explore Opportunities", "Skill Gap Radar", "Career GPS"]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await api.post('/ai/career-assistant', { message: query.trim() });
      if (res.success && res.data) {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.reply,
          source: res.data.source || 'CareerBridge Intelligence',
          suggested_actions: res.data.suggested_actions || []
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I encountered an error connecting to the platform knowledge base. Please check your network connection and try again.",
        source: 'Error Handler'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Chat cleared. Ask me anything about matching internships, missing skills, hackathons, or interview prep!`,
        source: 'CareerBridge Assistant'
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>AI Career Assistant</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              Grounded in Platform DB
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Contextual career guidance strictly verified against your authorized profile and live opportunities.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg flex flex-col h-[600px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-tr from-[#0B132B] to-[#2563EB] text-cyan-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && msg.source && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>Source: {msg.source}</span>
                    </div>
                  )}

                  {!isUser && msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggested_actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(`Tell me more about ${action}`)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-700 text-[10px] font-bold hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          {action} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 font-medium flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Consulting student profile and verified opportunity database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 overflow-x-auto flex space-x-2 no-scrollbar">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about internships, missing skills, interview prep, or hackathons..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
