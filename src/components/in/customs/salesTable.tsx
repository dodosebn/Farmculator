import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
Cell,
} from "recharts";
import { useState } from "react";
import { SalesTableProps } from "./type";

const SalesTable: React.FC<SalesTableProps> = ({
loading,
sales,
activeTab,
productRevenueData,
COLORS,
aiSummary,
generateAISummary,
isGeneratingSummary,
handleEditSale,
handleDeleteSale,
}) => {
const [localGenerating, setLocalGenerating] = useState(false);

const handleGenerateAI = async () => {
setLocalGenerating(true);
await new Promise((resolve) => setTimeout(resolve, 10));
await generateAISummary();
setLocalGenerating(false);
};

const showGenerating = isGeneratingSummary || localGenerating;

return ( <div className="p-6">
{loading ? ( <p>Loading sales...</p>
) : sales.length === 0 ? ( <p>No sales recorded yet.</p>
) : activeTab === "list" ? ( <div className="overflow-x-auto w-full"> <table className="min-w-max w-full text-sm"> <thead className="bg-gray-50"> <tr>
{["Product", "Qty", "Price", "Total", "Actions"].map((h) => ( <th
                 key={h}
                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
               >
{h} </th>
))} </tr> </thead>

        <tbody className="divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.id} className="whitespace-nowrap">
              <td className="px-6 py-4">{sale.product}</td>
              <td className="px-6 py-4">{sale.quantity}</td>
              <td className="px-6 py-4">
                ₦{sale.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 font-semibold text-green-600">
                ₦{sale.total.toLocaleString()}
              </td>
              <td className="px-6 py-4 space-x-3">
                <button
                  onClick={() => handleEditSale(sale)}
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteSale(sale.id)}
                  className="text-red-600 cursor-pointer hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : activeTab === "charts" ? (
    productRevenueData.length === 0 ? (
      <p>No product revenue data to display yet. Record a sale!</p>
    ) : (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={productRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [
              `₦${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Legend />

          <Bar dataKey="revenue">
            {productRevenueData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  ) : (
    <div className="text-start">
      {aiSummary ? (
        <p className="text-gray-700 whitespace-pre-wrap">{aiSummary}</p>
      ) : (
        <button
          onClick={handleGenerateAI}
          disabled={showGenerating || sales.length === 0}
          className={`bg-green-800 cursor-pointer text-white px-6 py-3 rounded-lg ${
            showGenerating ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {showGenerating ? "Analyzing..." : "Generate AI Summary"}
        </button>
      )}
    </div>
  )}
</div>

);
};

export default SalesTable;
