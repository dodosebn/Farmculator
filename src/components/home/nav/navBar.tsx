import UseLogo from "@/hooks/useLogo";
import { useNavigate } from "@tanstack/react-router";

const NavBar = () => {
  const navigate = useNavigate();

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/About",
    },
    {
      name: 'Services',
      path: '/Services',
    },
   
    {
      name: "SignIn",
      path: "/Account",
    },
  ];

  const handleRoute = (path: string) => {
    navigate({ to: path });
  };

  return (
    <nav className="bg-[#0a1905] px-6 py-4">
      <div className="flex items-center gap-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="shrink-0">
       <UseLogo />
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link, index) => (
            <li 
              key={index}
              onClick={() => handleRoute(link.path)}
              className="text-[#778871] text-lg font-semibold cursor-pointer 
              hover:text-white transition-colors duration-200"
            >
              {link.name}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;