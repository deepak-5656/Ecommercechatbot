
import React from 'react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} group animate-slide-in`}>
      <div className={`flex flex-col max-w-[85%] ${isModel ? 'items-start' : 'items-end'}`}>
        <div 
          className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isModel 
              ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 mx-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
