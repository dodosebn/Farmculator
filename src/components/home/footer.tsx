import UseLogo from "@/hooks/useLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a1905]
     text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-400 rounded-full
         blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96
         bg-green-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-10 py-16 max-w-7xl">
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <span>© {currentYear}</span>
              <div className="hidden md:flex"><UseLogo /></div>
              <span>All rights reserved.</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <span>
                created with ❤️ by{" "}
                <a
                  href="https://orji-dominion.vercel.app/About"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-red-600"
                >
                  DOMINION
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-emerald-400 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-4 right-4 w-6 h-6 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
    </footer>
  );
};

export default Footer;
