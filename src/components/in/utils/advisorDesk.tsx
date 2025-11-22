import { Bot, Send } from "lucide-react";
import { FiSidebar } from "react-icons/fi";
import GenPage from "../sidebar/genPage";
import { AdvisorProps } from "./type";

const AdvisorDesk: React.FC<AdvisorProps> = ({
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
    <main className="hidden md:block">
      <div className="flex h-screen bg-linear-to-br from-gray-50 to-green-50/30 overflow-hidden">
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
              {messages.length === 0 && (
                <div className="text-center space-y-6 w-full h-full flex flex-col justify-center items-center px-4">
                  {/* <UseLogo /> */}
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
                        <div className="shrink-0 w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md mt-1">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] ${
                          msg.role === "user"
                            ? "bg-linear-to-br from-green-500 to-green-600 text-white rounded-3xl rounded-br-md px-6 py-4 shadow-md"
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
                        <div className="shrink-0 w-8 h-8 bg-linear-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md mt-1">
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
                    className="absolute right-3 bottom-3 p-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100"
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
  );
};

export default AdvisorDesk;
