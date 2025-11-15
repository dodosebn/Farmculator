import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
if (!apiKey) throw new Error("Missing Google API Key");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const Route = createFileRoute(("/api/ai-summary") as any)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            salesData?: {
              totalSales: number;
              totalRevenue: number;
              totalQuantity: number;
              averagePrice: number;
              highestSale: number;
              lowestSale: number;
              topRevenueProduct: string; 
              topQuantityProduct: string; 
              products: Record<
                string,
                { totalRevenue: number; totalQuantity: number; count: number }
              >;
            };
          };

          if (!body?.salesData) {
            return json(
              { success: false, message: "Missing salesData in request" },
              { status: 400 }
            );
          }

          const { salesData } = body;

          const prompt = `
You are an intelligent business analyst. Analyze the following sales data and produce a concise, insightful summary.

Sales Overview:
- Total Sales: ${salesData.totalSales}
- Total Revenue: ₦${salesData.totalRevenue.toLocaleString()}
- Total Quantity Sold: ${salesData.totalQuantity}
- Average Price per Item: ₦${salesData.averagePrice.toFixed(2)}
- Highest Sale: ₦${salesData.highestSale.toLocaleString()}
- Lowest Sale: ₦${salesData.lowestSale.toLocaleString()}
- **Top Revenue Product**: ${
              salesData.topRevenueProduct || "N/A"
            } (Highest total earnings)
- **Top Quantity Product**: ${
              salesData.topQuantityProduct || "N/A"
            } (Most units sold)

Product Breakdown:
${Object.entries(salesData.products)
  .map(
    ([product, stats]) =>
      `• ${product}: ${stats.totalQuantity} units sold, ₦${stats.totalRevenue.toFixed(
        2
      )} revenue`
  )
  .join("\n")}

Generate a short, clear summary (3-4 sentences) highlighting:
1. Best-performing products and why (based on revenue/quantity)
2. Overall sales performance and key metrics
3. Observable patterns or trends (e.g., high average price, concentration of sales)
`;

          const result = await model.generateContent(prompt);
          const summary = result.response.text().trim();

          if (!summary) {
            return json(
              { success: false, message: "No summary generated" },
              { status: 500 }
            );
          }

          return json({ success: true, summary });
        } catch (error) {
          console.error("AI summary generation error:", error);
          return json(
            { success: false, message: "Failed to generate AI summary" },
            { status: 500 }
          );
        }
      },
    },
  },
});