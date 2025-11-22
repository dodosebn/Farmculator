import { FormEvent } from "react";

export type MessageRole = "user" | "model" | "function";

export type ChatMessage = {
  role: MessageRole;
  text: string;
  isGenerating?: boolean;
};

export interface AdvisorProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  handleSubmit: (e: FormEvent) => void;
  initial: string;
chatContainerRef: React.RefObject<HTMLDivElement | null>;
messagesEndRef: React.RefObject<HTMLDivElement | null>;  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
}
