import { FaSeedling } from "react-icons/fa";
const HeadLine = () => {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-xl">
            <FaSeedling size={32} />
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Sales Tracker
        </h1>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        Track your sales and revenue in real-time
      </p>
    </div>
  );
};

export default HeadLine;
