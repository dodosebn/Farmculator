import { useEffect } from "react";
import UseLogo from "@/hooks/useLogo";
import { useUserStore } from "@/hooks/useUserStore";
import { FiSidebar, FiPlus, FiMessageSquare } from "react-icons/fi";
import { Link } from "@tanstack/react-router";

interface GenPageProps {
  onToggleSidebar: () => void;
}

const GenPage = ({ onToggleSidebar }: GenPageProps) => {
  const { user, isLoading, error, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user && !isLoading && !error) fetchUser();
  }, [user, isLoading, error]);

  const displayName = user?.displayName || "User";
  const initial = user?.initial || "U";
  const email = user?.email || "";
  const hasName = user?.hasName || false;

  const chatHistory = [
    { id: 1, title: "Crop rotation advice", date: "2024-01-15" },
    { id: 2, title: "Soil pH analysis", date: "2024-01-14" },
    { id: 3, title: "Pest control methods", date: "2024-01-13" },
    { id: 4, title: "Irrigation scheduling", date: "2024-01-12" },
    { id: 5, title: "Livestock feeding", date: "2024-01-11" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/50">

      <div className="px-5 pb-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <UseLogo />
          <button
            onClick={onToggleSidebar}
            className="p-2.5 hover:bg-green-50 rounded-xl transition-all text-gray-600 hover:text-green-700"
          >
            <FiSidebar size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold shadow-md flex items-center gap-2 justify-center">
          <FiPlus size={18} /> New Chat
        </button>
      </div>

      {/* Scrollable section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-2">
            Recent Chats
          </h3>

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FiMessageSquare size={18} className="text-green-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {chat.title}
                </p>
                <p className="text-xs text-gray-500">{formatDate(chat.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white/80">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 cursor-pointer">
          <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center text-white">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              initial
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>

            {!hasName && email && (
              <Link to="/in/profile" className="text-xs text-orange-600">
                Complete your profile →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenPage;
