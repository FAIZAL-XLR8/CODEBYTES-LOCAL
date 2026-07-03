import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import axiosClient from "../src/utils/axiosClient";

export const renderInlineCode = (text) => {
  const parts = text.split('`');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <code key={index} className="bg-zinc-800 text-zinc-100 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-700/50">
          {part}
        </code>
      );
    }
    return part;
  });
};

export const renderMessageContent = (content) => {
  if (!content) return "";

  const lines = content.split('\n');
  return lines.map((line, lineIndex) => {
    let cleanLine = line;
    const isBullet = /^\s*[\*\-]\s+/.test(cleanLine);
    if (isBullet) {
      cleanLine = cleanLine.replace(/^\s*[\*\-]\s+/, "");
    }

    const parts = cleanLine.split('**');
    const formattedParts = parts.map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return (
          <strong key={partIndex} className="font-extrabold text-white">
            {renderInlineCode(part)}
          </strong>
        );
      }
      return renderInlineCode(part);
    });

    if (isBullet) {
      return (
        <div key={lineIndex} className="flex items-start gap-2 ml-2 my-1 text-sm text-zinc-300">
          <span className="text-indigo-400 mt-1.5 shrink-0 select-none">•</span>
          <div className="flex-1">{formattedParts}</div>
        </div>
      );
    }

    return (
      <div key={lineIndex} className="min-h-[1.2rem] my-1 text-sm text-zinc-300 leading-relaxed">
        {formattedParts}
      </div>
    );
  });
};


const AIChatAssistant = ({ problem, getCurrentCode }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: `Hi! I'm your AI coding assistant. I can help you with "${problem?.title}".\n\nI can provide:\n• Hints and approaches\n• Explanation of concepts\n• Time/space complexity analysis\n• Step-by-step guidance\n\nWhat would you like to know?`
        }
      ]);
    }
  }, [isOpen, problem]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');


    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const currentCode = getCurrentCode();
      const systemPrompt = `You are a helpful coding assistant for the problem "${problem?.title}" (Difficulty: ${problem?.difficulty}).

Problem Description: ${problem?.description}
Users current Code : ${currentCode}

Guidelines:
- Provide helpful hints and guidance
- Don't give away the complete solution
- Focus on teaching concepts and approaches
- Be encouraging and supportive
- If asked for hints, give progressive hints
- Explain time and space complexity when relevant
`;

      // Call backend API via axiosClient
      const response = await axiosClient.post("/ai/chat", {
        message: userMessage,
        systemPrompt,
      });

      const data = response.data;


      const assistantMessage = data.reply || 'Sorry, I could not generate a response.';

      setMessages(prev => [...prev, { role: 'model', content: assistantMessage }]);
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again or check your connection.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  //quick buttons actions ke liye
  const quickActions = [
    { label: 'Give me a hint', query: 'Can you give me a hint to solve this problem?' },
    { label: 'Explain approach', query: 'What approach should I use to solve this problem?' },
    { label: 'Time complexity', query: 'What should be the optimal time complexity?' },
    { label: 'Common mistakes', query: 'What are common mistakes people make with this problem?' }
  ];

  const handleQuickAction = (query) => {
    setInput(query);
  };

  return (
    <>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-1/2 right-6 -translate-y-1/2 btn btn-primary btn-circle btn-lg shadow-2xl hover:scale-110 transition-transform z-50"
          title="AI Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#282828] rounded-lg shadow-2xl border border-[#3d3d3d] flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#3d3d3d] bg-[#1e1e1e] rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>

              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                      ? 'bg-primary text-primary-content'
                      : 'bg-[#1e1e1e] text-gray-200 border border-[#3d3d3d]'
                    }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e1e] rounded-lg p-3 border border-[#3d3d3d]">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="btn btn-xs btn-ghost border border-[#3d3d3d] hover:border-primary"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-[#3d3d3d] bg-[#1e1e1e] rounded-b-lg">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="textarea textarea-bordered flex-1 bg-[#282828] border-[#3d3d3d] text-sm resize-none"
                rows="2"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="btn btn-primary btn-square"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;