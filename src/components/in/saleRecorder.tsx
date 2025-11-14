import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSalesStore } from "@/store/salesStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell, // <-- ADDED: Cell for custom bar colors
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const SaleRecorder = () => {
  const { sales, fetchSales, addSale, deleteSale, updateSale, loading } =
    useSalesStore();

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "charts" | "ai">("list");

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.product || !formData.quantity || !formData.price) return;

    setIsSubmitting(true);

    const saleData = {
      product: formData.product.trim(),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      total: Number(formData.quantity) * Number(formData.price),
    };

    try {
      if (editingId) {
        await updateSale(editingId, saleData);
        setEditingId(null);
      } else {
        await addSale(saleData);
      }

      setFormData({ product: "", quantity: "", price: "" });
    } catch (err) {
      console.error("Error submitting sale:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSale = (sale: any) => {
    setEditingId(sale.id);
    setFormData({
      product: sale.product,
      quantity: sale.quantity.toString(),
      price: sale.price.toString(),
    });
  };

  const handleDeleteSale = async (id: number) => {
    try {
      await deleteSale(id);
    } catch (err) {
      console.error("Error deleting sale:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ product: "", quantity: "", price: "" });
  };

  const generateAISummary = async () => {
    if (sales.length === 0) return;

    setIsGeneratingSummary(true);
    try {
      const productsBreakdown = sales.reduce((acc: any, sale) => {
        if (!acc[sale.product]) {
          acc[sale.product] = {
            totalRevenue: 0,
            totalQuantity: 0,
            count: 0,
          };
        }
        acc[sale.product].totalRevenue += sale.total;
        acc[sale.product].totalQuantity += sale.quantity;
        acc[sale.product].count += 1;
        return acc;
      }, {});

      // Calculate top products
      const productEntries = Object.entries(productsBreakdown) as [
        string,
        { totalRevenue: number; totalQuantity: number; count: number }
      ][];

      const topRevenueProduct = productEntries.reduce(
        (max, [name, stats]) =>
          stats.totalRevenue > max.stats.totalRevenue ? { name, stats } : max,
        { name: "", stats: { totalRevenue: -1 } }
      ).name;

      const topQuantityProduct = productEntries.reduce(
        (max, [name, stats]) =>
          stats.totalQuantity > max.stats.totalQuantity ? { name, stats } : max,
        { name: "", stats: { totalQuantity: -1 } }
      ).name;

      const salesData = {
        totalSales: sales.length,
        totalRevenue,
        totalQuantity,
        products: productsBreakdown,
        averagePrice: totalQuantity > 0 ? totalRevenue / totalQuantity : 0,
        highestSale: Math.max(...sales.map((s) => s.total)),
        lowestSale: Math.min(...sales.map((s) => s.total)),
        topRevenueProduct, // <-- ADDED
        topQuantityProduct, // <-- ADDED
      };

      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData }),
      });

      if (!response.ok) throw new Error("Failed to generate summary");

      const data = await response.json();
      setAiSummary(data.summary);
      setActiveTab("ai");
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary(
        "Sorry, I couldn't generate a summary at the moment. Please try again later."
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const productRevenueData = Object.entries(
    sales.reduce((acc: any, sale) => {
      acc[sale.product] = (acc[sale.product] || 0) + sale.total;
      return acc;
    }, {})
  ).map(([product, revenue]) => ({
    product,
    revenue: Number(revenue),
  }));

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Tracker</h1>
        </div>
        <p className="text-gray-600">Track your sales and revenue in real-time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? "Edit Sale" : "Add New Sale"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="e.g., Organic Wheat"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {formData.quantity && formData.price && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    Total: ₦
                    {(
                      Number(formData.quantity) * Number(formData.price)
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.product ||
                    !formData.quantity ||
                    !formData.price
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  {isSubmitting
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Sale"
                    : "Add Sale"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right section: stats & tabs */}
        <div className="lg:col-span-2">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Total Sales", value: sales.length, emoji: "📊" },
              {
                title: "Total Quantity",
                value: totalQuantity.toLocaleString(),
                emoji: "📦",
              },
              {
                title: "Total Revenue",
                value: `₦${totalRevenue.toLocaleString()}`,
                emoji: "💰",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span>{card.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {["list", "charts", "ai"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(tab as "list" | "charts" | "ai")
                    }
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "list"
                      ? "Sales List"
                      : tab === "charts"
                      ? "Charts"
                      : "AI Insights"}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {loading ? (
                <p>Loading sales...</p>
              ) : sales.length === 0 ? (
                <p>No sales recorded yet.</p>
              ) : activeTab === "list" ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Product", "Qty", "Price", "Total", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id}>
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
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSale(sale.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      {/* UPDATED: Added Cell component for multi-color bars */}
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
                <div>
                  {aiSummary ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {aiSummary}
                    </p>
                  ) : (
                    <button
                      onClick={generateAISummary}
                      disabled={isGeneratingSummary || sales.length === 0}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                      {isGeneratingSummary
                        ? "Analyzing..."
                        : "Generate AI Summary"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleRecorder;