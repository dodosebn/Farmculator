import {
  IoLinkOutline,
  IoCopyOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";

interface ShareSettings {
  includeCharts: boolean;
  includeAI: boolean;
  readOnly: boolean;
  expiresIn: string;
}

interface ShareLinkProps {
  showShareModal: boolean;
  setShowShareModal: (value: boolean) => void;
  shareSettings: ShareSettings;
  handleShareSettingsChange: (
    key: keyof ShareSettings,
    value: boolean | string
  ) => void;
  shareLink: string;
  handleCopyLink: () => void;
  isCopied: boolean;
  shareViaEmail: () => void;
  shareViaWhatsApp: () => void;
}

const ShareLink: React.FC<ShareLinkProps> = ({
  showShareModal,
  setShowShareModal,
  shareSettings,
  handleShareSettingsChange,
  shareLink,
  handleCopyLink,
  isCopied,
  shareViaEmail,
  shareViaWhatsApp,
}) => {
  return (
    <>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {" "}
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <h3 className="text-lg font-semibold text-gray-900">
                Share Dashboard
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>{" "}
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={shareSettings.includeCharts}
                    onChange={(e) =>
                      handleShareSettingsChange(
                        "includeCharts",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Include Charts</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={shareSettings.includeAI}
                    onChange={(e) =>
                      handleShareSettingsChange("includeAI", e.target.checked)
                    }
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Include AI Insights
                  </span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={shareSettings.readOnly}
                    onChange={(e) =>
                      handleShareSettingsChange("readOnly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Read-only access
                  </span>
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 shrink-0">
                    Expires in:
                  </span>
                  <select
                    value={shareSettings.expiresIn}
                    onChange={(e) =>
                      handleShareSettingsChange("expiresIn", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {[{
                        name: '1 day',
                        value: '1',
                    },
                    {
                        name: '7 days',
                        value: '7',
                    },
                      {
                        name: '30 days',
                        value: '30',
                    },
                     {
                        name: 'Never',
                        value: 'never',
                    },
                    ].map((item) => (
                    <option value={item.value}>{item.name}</option>))}
                  </select>
                </div>
              </div>

              {/* Share Link */}
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
                    className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1"
                  >
                    {isCopied ? (
                      <IoCheckmarkOutline className="w-4 h-4" />
                    ) : (
                      <IoCopyOutline className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={shareViaEmail}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Email
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareLink;
