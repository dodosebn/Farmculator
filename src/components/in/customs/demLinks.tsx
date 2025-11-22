import {
  IoCheckmarkOutline,
  IoCopyOutline,
  IoLinkOutline,
} from "react-icons/io5";
import { DemLinksProps } from "./type";

const DemLinks: React.FC<DemLinksProps> = ({
  shareLink,
  handleCopyLink,
  isCopied,
  shareViaWhatsApp,
}) => {
  return (
    <>
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <IoLinkOutline className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            Shareable Link
          </span>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 bg-white border border-gray-300 rounded-md
             px-3 py-2 text-sm text-gray-600 focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 
            transition-colors flex items-center space-x-1"
          >
            {isCopied ? (
              <IoCheckmarkOutline className="w-4 h-4" />
            ) : (
              <IoCopyOutline className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <button
        onClick={shareViaWhatsApp}
        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md
         hover:bg-green-600 transition-colors text-sm font-medium"
      >
        WhatsApp
      </button>
    </>
  );
};

export default DemLinks;
