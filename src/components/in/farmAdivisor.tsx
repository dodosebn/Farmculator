import { useState, useRef, useEffect, FormEvent } from "react";
import { Send } from "lucide-react";

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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      {/* <div className="border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <UseLogo />
      </div> */}

      {/* Chat / Empty State */}
      <div className={`flex-1 overflow-y-hidden   ${messages.length === 0 ? 'flex justify-center items-center' : ''}`}>
        <div className="max-w-3xl w-full px-4 py-8">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center space-y-4 w-full">
              <h2 className="text-2xl font-medium text-gray-900">
                How can I help with your farm today?
              </h2>
              <p className="text-gray-500">
                Ask me anything about farming, crops, livestock, or agricultural practices.
              </p>

              {/* Centered Form */}
              <form onSubmit={handleSubmit} className="relative mt-6 w-full">
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl
                   resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  rows={1}
                  disabled={isGenerating}
                  style={{ minHeight: "52px", maxHeight: "200px" }}
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
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="flex gap-4">
              
                  <div className={`flex-1 ${msg.role === "user" ? "md:ml-96 border-green-900 border-b-4" : ""}`}>
                    {msg.role === "user" && (
                      <div className="text-xl font-bold text-gray-900 mb-1">You</div>
                    )}
                    {msg.role === "model" && (
                      <div className="text-xl font-bold text-gray-900 mb-1">FarmCulator</div>
                    )}
                    
                    <div className={`prose prose-sm max-w-none ${msg.isGenerating ? "text-gray-400" : "text-gray-800"}`}>
                      {msg.isGenerating ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none
                 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent text-gray-900 placeholder-gray-400"
                rows={1}
                disabled={isGenerating}
                style={{ minHeight: "52px", maxHeight: "200px" }}
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
  );
};

export default FarmAdvisor;
