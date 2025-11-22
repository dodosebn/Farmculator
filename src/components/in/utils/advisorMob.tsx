import { Bot, Send, Sparkles } from "lucide-react";
import React from "react";
import GenPage from "../sidebar/genPage";
import { FiSidebar } from "react-icons/fi";
import UseLogo from "@/hooks/useLogo";
import { AdvisorProps } from "./type";

const AdvisorMob: React.FC<AdvisorProps> = ({
  isSidebarOpen,
  toggleSidebar,
  chatContainerRef,
  messages,
  isLoading,
  handleSubmit,
  initial,
  messagesEndRef,
  input,
  setInput,
  isGenerating,
}) => {
  return (
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
           hover:bg-green-50 transition border border-gray-200 ${isSidebarOpen && "hidden"}`}
      >
        <FiSidebar size={20} className="text-green-700" />
      </button>

      <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-green-50/30 pt-20 pb-32">
        <div className="flex-1 overflow-y-auto px-4 space-y-4 mb-4">
          {messages.length === 0 && (
            <>
              <UseLogo />
              <div className="text-center text-gray-600 text-lg leading-relaxed mt-20 px-4">
                Your intelligent farming assistant. Ask me anything about crops,
                soil, pests, and agricultural practices.
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
                <div className="shrink-0 w-6 h-6 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-linear-to-br from-green-500 to-green-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md"
                    : "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"
                }`}
              >
                <div
                  className={`text-sm leading-6 ${msg.role === "user" ? "text-green-50" : "text-gray-700"}`}
                >
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
                <div className="shrink-0 w-6 h-6 bg-linear-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md mt-1">
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

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-gray-200
           bg-white/90 backdrop-blur-md shadow-lg p-4"
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
                className="w-full px-4 py-3 pr-12 border border-green-700 rounded-xl
                    text-gray-900 placeholder-gray-400 bg-white 
                    transition-all duration-200 text-base leading-5"
                disabled={isGenerating}
                style={{ minHeight: "48px", maxHeight: "100px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="absolute right-2 bottom-2 p-2 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
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
  );
};

export default AdvisorMob;
