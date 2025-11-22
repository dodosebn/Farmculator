import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSalesStore } from "@/store/salesStore";

import SaleForm from "./customs/saleForm";
import SalesTable from "./customs/salesTable";
import { IoStatsChartSharp } from "react-icons/io5";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaMoneyCheckAlt } from "react-icons/fa";
import ShareLink from "./customs/shareLink";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    includeCharts: true,
    includeAI: true,
    readOnly: true,
    expiresIn: "7", 
  });

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const generateShareLink = () => {
    const shareData = {
      sales: shareSettings.readOnly ? sales : [],
      summary: shareSettings.includeAI ? aiSummary : "",
      settings: shareSettings,
      timestamp: new Date().toISOString(),
    };
    const encodedData = btoa(JSON.stringify(shareData));
    const baseUrl = window.location.origin;
    setShareLink(`${baseUrl}/share/${encodedData}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareSettingsChange = (key: string, value: any) => {
    setShareSettings({ ...shareSettings, [key]: value });
  };

  const handleShare = () => {
    generateShareLink();
    setShowShareModal(true);
  };

  const shareViaWhatsApp = () => {
    const shareData = {
      sales: shareSettings.readOnly ? sales : [],
      summary: shareSettings.includeAI ? aiSummary : "",
      settings: shareSettings,
      timestamp: new Date().toISOString(),
    };
    const encodedData = btoa(JSON.stringify(shareData));
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/share/${encodedData}`;

    const text = `Check out my sales dashboard: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

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

      const productEntries = Object.entries(productsBreakdown) as [
        string,
        { totalRevenue: number; totalQuantity: number; count: number },
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
        topRevenueProduct,
        topQuantityProduct,
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {" "}
      <ShareLink
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        shareSettings={shareSettings}
        handleShareSettingsChange={handleShareSettingsChange}
        shareLink={shareLink}
        handleCopyLink={handleCopyLink}
        isCopied={isCopied}
        shareViaWhatsApp={shareViaWhatsApp}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1">
          <SaleForm
            editingId={editingId}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            formData={formData}
            isSubmitting={isSubmitting}
            cancelEdit={cancelEdit}
            handleShare={handleShare}
          />
        </div>

        <div className="md:col-span-2 mt-6 md:mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: "Total Sales",
                value: sales.length,
                emoji: <IoStatsChartSharp size={24} />,
              },
              {
                title: "Total Quantity",
                value: totalQuantity.toLocaleString(),
                emoji: <MdProductionQuantityLimits size={24} />,
              },
              {
                title: "Total Revenue",
                value: `₦${totalRevenue.toLocaleString()}`,
                emoji: <FaMoneyCheckAlt size={24} />,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-4 sm:p-6 border border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-nowrap sm:text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                      <div className="bg-gray-100 rounded-full p-1">
                        {card.emoji}
                      </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto whitespace-nowrap no-scrollbar">
                {["list", "charts", "ai"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 px-5 text-sm font-medium border-b-2 shrink-0 ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500"
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

            <SalesTable
              loading={loading}
              sales={sales}
              activeTab={activeTab}
              productRevenueData={productRevenueData}
              COLORS={COLORS}
              aiSummary={aiSummary}
              generateAISummary={generateAISummary}
              handleEditSale={handleEditSale}
              handleDeleteSale={handleDeleteSale}
              isGeneratingSummary={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleRecorder;
