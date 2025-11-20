import UseLogo from "@/hooks/useLogo";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const IntroSentence = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const ImgFlippers = ["/img/flipper1.jpg", "/img/flipper3.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ImgFlippers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative w-full h-screen md:h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {ImgFlippers.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`flipper ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover 
                transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 bg-linear-to-br from-black/50
         via-black/30 to-emerald-900/40"
        />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className={`max-w-3xl text-center transform transition-all duration-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="flex flex-col items-center justify-center gap-2 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
              <span className="animate-pulse"> Welcome to</span>
              <UseLogo />
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-white leading-relaxed drop-shadow-md max-w-2xl mx-auto mb-6">
              A digital platform that helps farmers track sales, manage records,
              and get AI-driven insights about farm performance. Combining data
              management, visualization and AI intelligence to help farmers make
              smarter, data-informed decisions.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
              {[
                "📊 Track Sales",
                "🌿 Manage Records",
                "🤖 AI Insights",
                "📈 Data Visualization",
              ].map((feature, index) => (
                <span
                  key={feature}
                  className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-2 rounded-full border border-white/30 animate-bounce"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {feature}
                </span>
              ))}
            </div>
            <Link to="/Account">
              <button className="group bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-emerald-400/50">
                <span className="flex items-center gap-2">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">
                    🚀
                  </span>
                </span>
              </button>
            </Link>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          {ImgFlippers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSentence;
