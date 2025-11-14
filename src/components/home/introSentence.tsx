import UseLogo from "@/hooks/useLogo";
import { useState, useEffect } from "react";

const IntroSentence = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ImgFlippers = [
    "/img/flipper1.jpg",
    // "/img/flipper2.jpg",
    "/img/flipper3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ImgFlippers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-full h-full sm:h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={ImgFlippers[currentIndex]}
          alt={`flipper ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl text-center">
            <h1 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
              <span>Welcome to</span>
              <UseLogo />
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed drop-shadow-md">
              A Digital Platform that helps Farmers track sales, manage records,
              and get AI-driven insights about their farm performance. The app
              combines data Management, Visualization and AI Intelligence to help
              Farmers make Smarter, data-Informed decisions.
            </p>
          </div>
        </div>
        
            <div
          className="absolute md:top-1/2 bottom-64 right-8 -translate-y-1/2 bg-white/80 
          backdrop-blur-sm rounded-full p-3 flex flex-col gap-2"
        >
          {ImgFlippers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all cursor-pointer
              ${
                currentIndex === index
                  ? "bg-green-600 scale-110"
                  : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSentence;