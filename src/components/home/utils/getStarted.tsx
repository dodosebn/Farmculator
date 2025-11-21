import { Link } from '@tanstack/react-router';

const GetStarted = () => {
  return (
    <div className='cursor-pointer'>    <Link to="/Account">
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
            </div></div>
  )
}

export default GetStarted;