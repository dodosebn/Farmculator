import UseLogo from "@/hooks/useLogo";
import { useState, useEffect } from "react";
import GetStarted from "./utils/getStarted";

const AboutSentence = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full bg-[#0a1905] py-16 md:py-24" id="About">
      <div className="relative w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold
               text-[#009966] mb-6 drop-shadow-sm">
                About Us
              </h1>
              
              <p className="text-base md:text-lg text-white leading-relaxed mb-8">
                We are a leading farm organization in the country, designed to 
                <span className="font-semibold text-[#009966]"> empower farmers</span> with cutting-edge digital tools 
                for modern agricultural management.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: "📝",
                    title: "Curated Record Taking",
                    desc: "Standardized procedure for accurate farm documentation"
                  },
                  {
                    icon: "🤖",
                    title: "AI-Driven Insights",
                    desc: "Smart assistance and crop disease detection"
                  },
                //   {
                //     icon: "🌱",
                //     title: "Crop Health Analysis",
                //     desc: "Upload pictures for instant disease diagnosis"
                //   },
                  {
                    icon: "📊",
                    title: "Live Dashboard",
                    desc: "Real-time sharing with stakeholders"
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-sm p-4 border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-bold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className=" text-white text-base md:text-lg">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`transform transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="bg-linear-to-br from-emerald-600 to-green-700 rounded-2xl p-8 text-white shadow-2xl">
                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  Why Choose FarmCulator?
                </h2>
                
                <ul className="space-y-4">
                  {[
                    {
                      title: "Standardized Excellence",
                      desc: "Manual record-taking lacks consistency. Farmculator provides industry-standard procedures for reliable documentation."
                    },
                    {
                      title: "Seamless Collaboration",
                      desc: "No more manual reports. Share live dashboard links with stakeholders for instant access to sales and performance data."
                    },
                    {
                      title: "Trust & Professionalism",
                      desc: "Follows business documentation standards. Farmculator ensures your records are audit-ready and professionally maintained."
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
              {[
  { num: "500+", label: "Farmers" },
  { num: "99%", label: "Accuracy" },
  { num: "24/7", label: "Support" },
].map((item, index) => (
  <div key={index}>
    <div className="text-2xl font-bold">{item.num}</div>
    <div className="text-xs opacity-80">{item.label}</div>
  </div>
))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#009966] mb-4">
              Ready to Transform Your Farming?
            </h3>
            <p className="text-white mb-6 max-w-2xl mx-auto text-base md:text-lg">
              Join hundreds of farmers who are already making data-driven decisions 
              and growing their business with Farmculator.
            </p>
          <GetStarted />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSentence;