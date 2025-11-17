import { useState, useRef, useEffect, FormEvent } from "react";
import { Send } from "lucide-react";
import GenPage from "./sidebar/genPage";

type MessageRole = "user" | "model" | "function";
type ChatMessage = {
  role: MessageRole;
  text: string;
  isGenerating?: boolean;
};

const FarmAdvisor = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Disable body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = { role: "user", text: input.trim() };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    setMessages((prev) => [...prev, { role: "model", text: "...", isGenerating: true }]);

    try {
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role, 
        parts: [{ text: msg.text }]
      }));
      
      const response = await fetch("/api/farm-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1); 
        return [
          ...newMessages,
          { role: "model", text: data.response, isGenerating: false }
        ];
      });

    } catch (error) {
      console.error("Chat generation error:", error);
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1); 
        return [
          ...newMessages,
          { role: "model", text: "Sorry, I ran into an error generating the advice.", isGenerating: false }
        ];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div>
        <GenPage />
      </div>
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Container - This will have the only scroll */}
      <div 
        className={`flex-1 overflow-y-auto ${messages.length === 0 ? 'flex justify-center items-center' : ''}`}
      >
        <div className="max-w-3xl w-full mx-auto px-4 py-8">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center space-y-4 w-full">
              <h2 className="text-2xl font-medium text-gray-900">
                How can I help with your farm today?
              </h2>
              <p className="text-gray-500">
                Ask me anything about farming, crops, livestock, or agricultural practices.
              </p>

              <form onSubmit={handleSubmit} className="relative mt-6 w-full max-w-2xl mx-auto">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask about planting seasons, crop rotation, pest control, irrigation..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  rows={3}
                  disabled={isGenerating}
                  style={{ minHeight: "120px" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="absolute right-2 bottom-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-8 pb-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] ${
                      msg.role === "user" 
                        ? "bg-green-50 border border-green-200 rounded-2xl rounded-tr-sm px-4 py-3" 
                        : "bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      msg.role === "user" ? "text-green-800" : "text-gray-800"
                    }`}>
                      {msg.role === "user" ? "You" : "FarmCulator"}
                    </div>
                    
                    <div className={`text-sm ${msg.isGenerating ? "text-gray-500" : "text-gray-700"}`}>
                      {msg.isGenerating ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap leading-6">{msg.text}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Input Area for ongoing chat */}
      {messages.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about planting seasons, crop rotation, pest control, irrigation..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                rows={1}
                disabled={isGenerating}
                style={{ minHeight: "52px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="absolute right-2 bottom-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default FarmAdvisor;