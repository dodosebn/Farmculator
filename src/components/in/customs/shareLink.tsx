import { ShareLinkProps, timeStamps } from "./type";
import DemLinks from "./demLinks";

const ShareLink: React.FC<ShareLinkProps> = ({
  showShareModal,
  setShowShareModal,
  shareSettings,
  handleShareSettingsChange,
  shareLink,
  handleCopyLink,
  isCopied,
  shareViaWhatsApp,
}) => {
  return (
    <>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {" "}
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              {" "}
              <h3 className="text-lg font-semibold text-gray-900">
                Share Dashboard
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close Share Modal"
              >
                ✕{" "}
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
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-green-500 
                    focus:border-green-500"
                  >
                    {timeStamps.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DemLinks
                shareLink={shareLink}
                handleCopyLink={handleCopyLink}
                isCopied={isCopied}
                shareViaWhatsApp={shareViaWhatsApp}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareLink;
