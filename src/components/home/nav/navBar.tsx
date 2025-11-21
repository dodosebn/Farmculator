import UseLogo from "@/hooks/useLogo";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "#About" },
    { name: "Services", path: "#Services" },
    { name: "SignIn", path: "/Account" },
  ];

  const handleRoute = (path: string) => {
  if (!path.startsWith("#")) {
    navigate({ to: path });
    setIsMenuOpen(false);
    return;
  }

  const id = path.replace("#", "");

  navigate({
    to: "/",  
    hash: id, 
    hashScrollIntoView: { behavior: "smooth" },
  });

  setIsMenuOpen(false);
};


  return (
    <nav className="relative bg-[#0a1905] px-4 sm:px-6 py-4 shadow-md">
      <div className="flex items-center gap-20 mx-auto">
        <div
          className="shrink-0 cursor-pointer"
          onClick={() => handleRoute("/")}
        >
          <UseLogo />
        </div>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link, index) => (
            <li
              key={index}
              onClick={() => handleRoute(link.path)}
              className="text-[#778871] text-base lg:text-lg font-semibold cursor-pointer 
              hover:text-white transition-colors duration-200"
            >
              {link.name}
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 text-[#778871] hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-[#0a1905]
         border-t border-[#1a2a15] z-9999"
        >
          <ul className="flex mx-auto justify-center text-center flex-col py-4">
            {navLinks.map((link, index) => (
              <li
                key={index}
                onClick={() => handleRoute(link.path)}
                className="text-[#778871] text-lg font-semibold cursor-pointer 
                hover:text-white transition-colors duration-200 px-6 py-3
                border-b border-[#1a2a15] last:border-b-0"
              >
                {link.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
