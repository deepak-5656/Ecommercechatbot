
import React, { useState, useRef, useEffect } from 'react';
import { Message, CustomerDetails } from '../types';
import { chatWithAI } from '../services/geminiService';
import MessageItem from './MessageItem';
import { BRAND_NAME } from '../constants';

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your ${BRAND_NAME} assistant. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedDetails, setCapturedDetails] = useState<CustomerDetails>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithAI(inputText, history);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date()
      };

      // Process function calls for capturing details
      if (response.functionCalls && response.functionCalls.length > 0) {
        response.functionCalls.forEach(fc => {
          if (fc.name === 'capture_customer_details') {
            const args = fc.args as CustomerDetails;
            setCapturedDetails(prev => ({
              ...prev,
              orderId: args.orderId || prev.orderId,
              email: args.email || prev.email,
              mobile: args.mobile || prev.mobile
            }));
          }
        });
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: 'error',
        role: 'model',
        text: "I encountered a slight technical hitch. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress for UI
  const detailsCount = [capturedDetails.orderId, capturedDetails.email, capturedDetails.mobile].filter(Boolean).length;
  const isOrderFlowStarted = detailsCount > 0;

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 z-[60] animate-slide-in overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">{BRAND_NAME} Support</h3>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] text-indigo-100">AI Assistant Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Progress & Captured Details UI */}
      {isOrderFlowStarted && (
        <div className="bg-indigo-50 border-b border-indigo-100">
          <div className="px-4 py-2 flex items-center justify-between text-[11px] font-medium text-indigo-700">
            <span>Verification Progress</span>
            <span>{detailsCount}/3 steps</span>
          </div>
          <div className="h-1 w-full bg-indigo-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${(detailsCount / 3) * 100}%` }}
            ></div>
          </div>
          <div className="p-3 grid grid-cols-3 gap-2">
            <div className={`flex flex-col items-center p-1.5 rounded-lg border ${capturedDetails.orderId ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
              <span className="text-[9px] font-bold">ORDER</span>
            </div>
            <div className={`flex flex-col items-center p-1.5 rounded-lg border ${capturedDetails.email ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span className="text-[9px] font-bold">EMAIL</span>
            </div>
            <div className={`flex flex-col items-center p-1.5 rounded-lg border ${capturedDetails.mobile ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="text-[9px] font-bold">MOBILE</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex space-x-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={detailsCount < 3 && isOrderFlowStarted ? `Next: ${!capturedDetails.orderId ? 'Order ID' : !capturedDetails.email ? 'Email' : 'Mobile'}` : "Type your message..."}
            className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-400 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;
