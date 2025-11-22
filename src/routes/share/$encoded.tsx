import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';

export const Route = createFileRoute('/share/$encoded')({
  component: SharePage,
});

async function fetchAISummaryFromServer(salesData: any) {
  const res = await fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salesData }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to generate AI summary');
  return data.summary;
}

function SharePage() {
  const { encoded } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(encoded));

      if (decoded.settings?.expiresIn !== "never") {
        const linkDate = new Date(decoded.timestamp);
        const expiryDays = Number(decoded.settings.expiresIn);
        const expiresAt = new Date(linkDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);
        if (new Date() > expiresAt) {
          setError("This share link has expired.");
          return;
        }
      }

      setData(decoded);
    } catch (e) {
      console.error(e);
      setError("Invalid or corrupted share link.");
    }
  }, [encoded]);

  const generateAISummary = async () => {
    if (!data?.sales) return;

    setIsGeneratingSummary(true);

    try {
      const sales = data.sales;
      const totalRevenue = sales.reduce((acc: number, s: any) => acc + s.total, 0);
      const totalQuantity = sales.reduce((acc: number, s: any) => acc + s.quantity, 0);
      const totalSales = sales.length;
      const averagePrice = totalRevenue / totalQuantity;
      const highestSale = Math.max(...sales.map((s: any) => s.total));
      const lowestSale = Math.min(...sales.map((s: any) => s.total));

      const products: Record<string, { totalRevenue: number; totalQuantity: number; count: number }> = {};
      sales.forEach((s: any) => {
        if (!products[s.product]) products[s.product] = { totalRevenue: 0, totalQuantity: 0, count: 0 };
        products[s.product].totalRevenue += s.total;
        products[s.product].totalQuantity += s.quantity;
        products[s.product].count += 1;
      });

      const topRevenueProduct = Object.entries(products).sort((a, b) => b[1].totalRevenue - a[1].totalRevenue)[0]?.[0];
      const topQuantityProduct = Object.entries(products).sort((a, b) => b[1].totalQuantity - a[1].totalQuantity)[0]?.[0];

      const salesData = {
        totalSales,
        totalRevenue,
        totalQuantity,
        averagePrice,
        highestSale,
        lowestSale,
        topRevenueProduct,
        topQuantityProduct,
        products,
      };

      const summary = await fetchAISummaryFromServer(salesData);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate AI summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (error) return <div className="max-w-lg mx-auto p-5 text-center"><h1 className="text-2xl font-bold text-red-600 mb-4">Link Error</h1><p className="text-gray-700">{error}</p></div>;
  if (!data) return <div className="max-w-lg mx-auto p-5 text-center"><p className="text-gray-600">Loading shared dashboard...</p></div>;

  const { sales, settings } = data;

  // Prepare chart data
  const productRevenueData = sales?.length
    ? Object.entries(
        sales.reduce((acc: any, sale: any) => {
          acc[sale.product] = (acc[sale.product] || 0) + sale.total;
          return acc;
        }, {})
      ).map(([product, revenue]) => ({ product, revenue: Number(revenue) }))
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Shared Sales Dashboard</h1>

      {settings.readOnly && <p className="text-sm text-gray-500 text-center">This dashboard is in read-only mode.</p>}

      {/* SALES TABLE */}
      {sales?.length > 0 ? (
        <div className="bg-white shadow p-4  border">
          <h2 className="text-lg font-semibold mb-3">Sales List</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="border p-2">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s: any, i: number) => (
                <tr key={i} className="border">
                  <td className="p-2 border">{s.product}</td>
                  <td className="p-2 border">{s.quantity}</td>
                  <td className="p-2 border">₦{s.price.toLocaleString()}</td>
                  <td className="p-2 border font-semibold">₦{s.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No sales to display (sender disabled sharing).</p>
      )}

      {/* AI SUMMARY */}
      {settings.includeAI && (
        <div className="bg-white shadow p-4  border">
          <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
          {aiSummary ? (
            <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>
          ) : (
            <button
              onClick={generateAISummary}
              disabled={isGeneratingSummary}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isGeneratingSummary ? "Analyzing..." : "Generate AI Summary"}
            </button>
          )}
        </div>
      )}

      {/* CHARTS */}
      {settings.includeCharts ? (
        <div className="bg-white shadow p-4  border">
          <h2 className="text-lg font-semibold mb-4 text-center">Revenue by Product</h2>
          {productRevenueData.length === 0 ? (
            <p className="text-gray-500 text-center">No product revenue data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productRevenueData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₦${Number(value).toLocaleString()}`, "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue">
                  {productRevenueData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Charts were excluded by the sender.</p>
      )}
    </div>
  );
}
