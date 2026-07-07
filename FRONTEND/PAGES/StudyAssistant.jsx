import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Sparkles, Send, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import axiosClient from "../src/utils/axiosClient";

const StudyAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hello! I am your DSA Study Assistant.\n\nAsk me any concept, complexity, or algorithm details, and I will help you master them!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to history
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/study-assistant", {
        message: userMessage
      });

      const { reply } = response.data;
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: reply || "I couldn't process that query."
      }]);
    } catch (error) {
      console.error("Error communicating with study assistant:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Sorry, I ran into an error retrieving textbook guidelines. Let's try again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageMarkdown = (content) => {
    if (!content) return "";
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let cleanLine = line;
      const isBullet = /^\s*[\*\-]\s+/.test(cleanLine);
      if (isBullet) {
        cleanLine = cleanLine.replace(/^\s*[\*\-]\s+/, "");
      }

      // Inline code blocks (`code`)
      const parts = cleanLine.split('`');
      const formattedParts = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return (
            <code key={partIdx} className="bg-zinc-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800">
              {part}
            </code>
          );
        }
        
        // Bold formatting
        const boldParts = part.split('**');
        return boldParts.map((bPart, bIdx) => {
          if (bIdx % 2 === 1) {
            return <strong key={bIdx} className="font-extrabold text-white">{bPart}</strong>;
          }
          return bPart;
        });
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1 text-sm text-zinc-300">
            <span className="text-emerald-500 mt-1.5 shrink-0 select-none">•</span>
            <div className="flex-1">{formattedParts}</div>
          </div>
        );
      }

      return (
        <div key={idx} className="min-h-[1.2rem] my-1 text-sm text-zinc-300 leading-relaxed">
          {formattedParts}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#080d18] text-zinc-100 font-sans flex flex-col h-screen overflow-hidden">
      {/* Navbar Header */}
      <nav className="bg-[#0a0f1e]/90 backdrop-blur-md border-b border-zinc-800/50 px-6 h-16 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/problems")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft size={13} />
            Back to Problems
          </button>
          <div className="w-px h-4 bg-zinc-700" />
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-400" />
            DSA Textbook Study Assistant
          </h2>
        </div>

        <NavLink to="/" className="text-lg font-black text-white tracking-tight hover:opacity-90 transition-opacity">
          Code<span className="text-emerald-400">Bytes</span><span className="text-emerald-400">.</span>
        </NavLink>
      </nav>

      {/* Main Chat Layout */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
        <div className="w-full max-w-3xl h-full flex flex-col bg-zinc-900/60 border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Background vector glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Conversation history area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className="max-w-[85%] flex flex-col gap-1">
                    <div
                      className={`rounded-2xl p-4 shadow-md text-sm leading-relaxed border ${
                        isUser
                          ? 'bg-emerald-600 border-emerald-500 text-white rounded-tr-none'
                          : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-200 rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="space-y-1.5">{renderMessageMarkdown(msg.content)}</div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800/80 rounded-tl-none shadow-md">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom input area */}
          <div className="p-4 bg-zinc-950/75 border-t border-zinc-800/50 flex flex-col gap-2 shrink-0">
            <div className="flex gap-2 items-center relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask details of algorithms or data structures..."
                rows="2"
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl p-3.5 pr-14 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder-zinc-650 resize-none font-sans scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-3.5 bottom-3.5 flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-600 px-1 font-mono">
              <span className="flex items-center gap-1">
                <Sparkles size={10} className="text-emerald-500" />
                Gemini-3.1-flash-lite Active
              </span>
              <span>Press Enter to Send</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;
