import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
if (!GEMINI_API_KEY) throw new Error("Missing Google API Key");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const Route = createFileRoute("/api/farm-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            chatHistory: { role: string; parts: { text: string }[] }[];
          };

          if (!body?.chatHistory || body.chatHistory.length === 0) {
            return json(
              { response: "Please provide a message to start the chat." },
              { status: 400 }
            );
          }

          // SYSTEM INSTRUCTION
          const systemInstruction = `
            You are an expert Farm Advisor. Provide concise agricultural help,
            planting guidance, pest control tips, soil insights, and answer farming
            questions effectively. Use simple language.
          `;

          const response = await model.generateContent({
            systemInstruction,
            contents: body.chatHistory,
          });

          const reply = response.response.text().trim();

          return json({ response: reply });

        } catch (error) {
          console.error("AI Farm Advisor error:", error);
          return json(
            {
              response:
                "A critical server error occurred while processing your request.",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
