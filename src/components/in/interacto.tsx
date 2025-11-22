import { Link, useNavigate } from "@tanstack/react-router";
import Buttino from "./customs/buttino";
import { IoDocumentLockSharp } from "react-icons/io5";
import { FaTrainTram } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { supabase } from "@/store/supabase";
import { useState } from "react";

const Interacto = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate({ to: "/" });
    } else {
      console.error("Logout failed:", error.message);
    }
    setShowLogoutConfirm(false);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const Todos = [
    {
      name: "Manage Records",
      path: "/in/Dashboard",
      icon: <IoDocumentLockSharp size={20} />,
    },
    {
      name: "Chat With AI Farm Advisor",
      path: "/in/farm-advisor",
      icon: <FaTrainTram size={20} />,
    },
    { name: "Logout", icon: <CiLogout />, action: openLogoutConfirm },
  ];
  const todos = [
    {
      name: "Records",
      path: "/in/Dashboard",
      icon: <IoDocumentLockSharp size={20} />,
    },
    {
      name: "Farm Advisor",
      path: "/in/farm-advisor",
      icon: <FaTrainTram size={20} />,
    },
    { name: "Logout", icon: <CiLogout />, action: openLogoutConfirm },
  ];
  return (
    <div className="flex flex-col md:items-center items-start px-6 md:px-0 gap-3 relative">
      <div className="absolute md:top-7 top-14 right-7">
        <button
          onClick={openLogoutConfirm}
          className="relative cursor-pointer group flex items-center p-1
           hover:bg-green-400 rounded-xl transition-colors duration-200"
          title="Logout"
        >
          <span
            className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-700
           hover:text-black transition-colors"
          >
            <CiLogout size={18} />
            Logout
          </span>
          <CiLogout
            size={24}
            className="md:hidden text-gray-600 hover:text-black
           transition-colors"
          />
          <span
            className="
            absolute left-1/2 -translate-x-1/2 -top-8
            bg-black text-white text-xs px-2 py-1 rounded
            opacity-0 group-hover:opacity-100
            pointer-events-none whitespace-nowrap
            transition-all duration-200 z-50
            md:hidden
          "
          >
            Logout
          </span>
        </button>
      </div>

      <p className="text-lg text-center flex mx-auto font-semibold mt-2">
        What do you want to do today?
      </p>

      <div className="md:flex gap-2 hidden">
        {Todos.filter((todo) => todo.name !== "Logout").map((todo, index) =>
          todo.action ? (
            <button
              key={index}
              onClick={todo.action}
              className="cursor-pointer"
            >
              <Buttino>{todo.name}</Buttino>
            </button>
          ) : (
            <Link to={todo.path} key={index} className="cursor-pointer">
              <Buttino>{todo.name}</Buttino>
            </Link>
          )
        )}
      </div>

      <div className="md:hidden gap-2 flex">
        {todos
          .filter((todo) => todo.name !== "Logout")
          .map((todo, index) =>
            todo.action ? (
              <button
                key={index}
                onClick={todo.action}
                className="relative cursor-pointer group flex items-start"
              >
                <Buttino>{todo.name}</Buttino>
                <span
                  className="
                absolute left-1/2 -translate-x-1/2 -top-8
                bg-black text-white text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none whitespace-nowrap
                transition-all duration-200
              "
                >
                  {todo.name}
                </span>
              </button>
            ) : (
              <Link
                to={todo.path}
                key={index}
                className="relative group flex items-start"
              >
                <Buttino>{todo.name}</Buttino>
                <span
                  className="
                absolute left-1/2 -translate-x-1/2 -top-8
                bg-black text-white text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none whitespace-nowrap
                transition-all duration-200
              "
                >
                  {todo.name}
                </span>
              </Link>
            )
          )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeLogoutConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interacto;
