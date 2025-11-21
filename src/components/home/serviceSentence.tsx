import UseLogo from "@/hooks/useLogo";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const ServiceSentence = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: "📊",
      title: "Smart Record Keeping",
      description: "Automated farm documentation with standardized templates that ensure accuracy and compliance with agricultural best practices.",
      features: ["Sales Tracking", "Expense Management", "Inventory Records", "Crop Rotation Logs"],
      color: "from-[#009966] to-emerald-600"
    },
    {
      icon: "🤖",
      title: "AI Farm Assistant",
      description: "Advanced artificial intelligence that provides real-time insights and recommendations for optimal farm management decisions.",
      features: ["Disease Detection", "Yield Prediction", "Market Analysis", "Growth Monitoring"],
      color: "from-[#009966] to-green-700"
    },
    {
      icon: "🔗",
      title: "Stakeholder Portal",
      description: "Seamlessly share farm performance data with investors, partners, or managers through secure, real-time dashboard links.",
      features: ["Live Sharing", "Access Control", "Export Options", "Custom Views"],
      color: "from-emerald-600 to-[#009966]"
    }
  ];

  return (
    <div className="relative w-full border-t border-t-sky-100/30 py-16 bg-[#0a1905]" 
    id="Services">
      <div className="relative w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Our <span className="text-[#009966]">Services</span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Empowering farmers with cutting-edge digital tools that transform 
                traditional farming into <span className="font-semibold text-[#009966]">data-driven agriculture</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-[#0f2208] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-900/50 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Service Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-r ${service.color} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                  {service.icon}
                </div>

                {/* Service Content */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm
                     text-gray-300">
                      <div className="w-2 h-2 bg-[#009966] rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-gradient-to-r from-[#0f2208] to-[#0a1905] hover:from-[#009966] hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-emerald-700/50">
                  Learn More →
                </button>
              </div>
            ))}
          </div>

          <div
            className={`text-center bg-linear-to-r from-[#009966] to-emerald-700 rounded-3xl p-12 text-white shadow-2xl transform transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <UseLogo />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-4">
              Ready to Revolutionize Your Farming?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of farmers who are already making data-driven decisions 
              and growing their business with Farmculator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to='/Account' className="bg-white text-[#009966] hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                SignUp Now
              </Link>
             
            </div>

            <div className="mt-8 grid grid-cols-3 md:gap-6 gap-3 text-center">
              {[
                { number: "500+", label: "Active Farmers" },
                { number: "99%", label: "Accuracy Rate" },
                { number: "24/7", label: "AI Support" },
                // { number: "50%", label: "Yield Increase" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold">{stat.number}</div>
                  <div className="text-white/80 text-base md:text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#009966] rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-800 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSentence;