import { useState, useRef, useEffect, FormEvent } from "react";
import { useUserStore } from "@/hooks/useUserStore";
import AdvisorDesk from "./utils/advisorDesk";
import AdvisorMob from "./utils/advisorMob";

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
      <AdvisorDesk
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatContainerRef={chatContainerRef}
        messages={messages}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        initial={initial}
        messagesEndRef={messagesEndRef}
        input={input}
        setInput={setInput}
        isGenerating={isGenerating}
      />

      <AdvisorMob
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatContainerRef={chatContainerRef}
        messages={messages}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        initial={initial}
        messagesEndRef={messagesEndRef}
        input={input}
        setInput={setInput}
        isGenerating={isGenerating}
      />
    </>
  );
};

export default FarmAdvisor;
