import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import GenPage from "./sidebar/genPage";
import { FiSidebar } from "react-icons/fi";
import { useUserStore } from "@/hooks/useUserStore";
import UseLogo from "@/hooks/useLogo";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, error, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user && !isLoading && !error) fetchUser();
  }, [user, isLoading, error]);

  const initial = user?.initial || "U";

  useEffect(() => {
    return () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = { role: "user", text: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    setMessages((prev) => [
      ...prev,
      { role: "model", text: "...", isGenerating: true },
    ]);

    try {
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
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
          { role: "model", text: data.response, isGenerating: false },
        ];
      });
    } catch (error) {
      console.error("Chat generation error:", error);
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        return [
          ...newMessages,
          {
            role: "model",
            text: "Sorry, I ran into an error generating the advice.",
            isGenerating: false,
          },
        ];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* DESKTOP LAYOUT */}
      <main className="hidden md:block">
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50/30 overflow-hidden">
          {isSidebarOpen && (
            <div className="w-80 border-r border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
              <GenPage onToggleSidebar={toggleSidebar} />
            </div>
          )}

          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              !isSidebarOpen ? "ml-0" : ""
            }`}
          >
            {!isSidebarOpen && (
              <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
                <button
                  onClick={toggleSidebar}
                  className="p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200
                   text-green-700 hover:text-green-800 border hover:border-green-200"
                >
                  <FiSidebar size={20} />
                </button>
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto min-h-0 scroll-smooth"
            >
              <div
                className={`w-full mx-auto px-4 sm:px-6 py-6 min-h-full ${
                  isSidebarOpen ? "max-w-4xl" : "max-w-6xl"
                }`}
              >
                {/* EMPTY STATE */}
                {messages.length === 0 && (
                  <div className="text-center space-y-6 w-full h-full flex flex-col justify-center items-center px-4">
                 <UseLogo />
                    <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                      Your intelligent farming assistant. Ask me anything about
                      crops and agricultural practices.
                    </p>
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="space-y-6 pb-6">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-4 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.role === "model" && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md mt-1">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl rounded-br-md px-6 py-4 shadow-md"
                              : "bg-white border border-gray-200 rounded-3xl rounded-bl-md px-6 py-4 shadow-sm"
                          }`}
                        >
                          <div
                            className={`text-sm leading-7 ${
                              msg.role === "user"
                                ? "text-green-50"
                                : "text-gray-700"
                            }`}
                          >
                            {msg.isGenerating ? (
                              <div className="flex items-center gap-2">
                                <span className="flex gap-1">
                                  <span
                                    className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></span>
                                  <span
                                    className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  ></span>
                                  <span
                                    className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  ></span>
                                </span>
                                <span className="text-green-600">
                                  Thinking...
                                </span>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap leading-7">
                                {msg.text}
                              </div>
                            )}
                          </div>
                        </div>

                        {msg.role === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md mt-1">
                            <div className="w-3 h-3 text-white flex items-center justify-center text-xs font-medium">
                              {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                initial
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* INPUT AREA */}
            <div className="border-t border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-lg">
              <div
                className={`mx-auto px-4 sm:px-6 py-5 ${
                  isSidebarOpen ? "max-w-4xl" : "max-w-6xl"
                }`}
              >
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask about crops, livestock, or any farming topic..."
                      className="w-full px-5 py-4 pr-16 border border-green-700 
                      rounded-2xl
                        text-gray-900 placeholder-gray-400 bg-white 
                        transition-all duration-200 text-lg leading-6"
                      disabled={isGenerating}
                      style={{ minHeight: "60px", maxHeight: "120px" }}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isGenerating}
                      className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {isGenerating
                      ? "FarmCulator is thinking..."
                      : "Press Enter to send, Shift+Enter for new line"}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE LAYOUT */}
      <div className="block md:hidden relative">
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl transform transition-transform duration-300 z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <GenPage onToggleSidebar={toggleSidebar} />
        </div>

        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}

        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-3 bg-white shadow-xl rounded-xl
           hover:bg-green-50 transition border border-gray-200 ${isSidebarOpen && 'hidden'}`}
        >
          <FiSidebar size={20} className="text-green-700" />
        </button>

        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50/30 pt-20 pb-32">
        

          <div className="flex-1 overflow-y-auto px-4 space-y-4 mb-4">
            {messages.length === 0 && (<>
                                                      <UseLogo />
              <div className="text-center text-gray-600 text-lg leading-relaxed mt-20 px-4">
                Your intelligent farming assistant.  
                Ask me anything about crops, soil, pests, and agricultural practices.
              </div>
              </>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "model" && (
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md"
                      : "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"
                  }`}
                >
                  <div className={`text-sm leading-6 ${msg.role === "user" ? "text-green-50" : "text-gray-700"}`}>
                    {msg.isGenerating ? (
                      <div className="flex items-center gap-2">
                        <span className="flex gap-1">
                          <span
                            className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </span>
                        <span className="text-green-600 text-xs">
                          Thinking...
                        </span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-6">
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md mt-1">
                    <div className="text-white text-xs font-medium flex items-center justify-center">
                      {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        initial
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 backdrop-blur-md shadow-lg p-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask about crops, livestock, or any farming topic..."
                  className="w-full px-4 py-3 pr-12 border border-green-700 rounded-xl
                    text-gray-900 placeholder-gray-400 bg-white 
                    transition-all duration-200 text-base leading-5"
                  disabled={isGenerating}
                  style={{ minHeight: "48px", maxHeight: "100px" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                >
                  {isGenerating ? (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {isGenerating
                  ? "FarmCulator is thinking..."
                  : "Press Enter to send"}
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmAdvisor;