
import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import { WEBSITE_URL, BRAND_NAME } from './constants';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <main className="text-center max-w-2xl animate-slide-in">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{BRAND_NAME}</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your premium shopping destination at <span className="font-semibold text-indigo-600">{WEBSITE_URL}</span>. 
          Experience seamless commerce with our new AI Assistant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800 mb-2">Fast Shipping</h3>
            <p className="text-sm text-gray-500">Get your products delivered in record time with our optimized logistics network.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-500">Our AI assistant is always online to help you with order tracking and inquiries.</p>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Open Chat"
        >
          <div className="absolute -top-2 -left-2 bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">1</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        </button>
      )}

      {/* Chat Component */}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}

      <footer className="fixed bottom-4 text-xs text-gray-400">
        © 2024 {BRAND_NAME}. Powered by Gemini AI.
      </footer>
    </div>
  );
};

export default App;
