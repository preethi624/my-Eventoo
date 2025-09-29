import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { GeminiResponse } from "src/interface/IChatResponse";
import { IChatRepository } from "./repositoryInterface/IChatRepository";
import EventModel, { IEvent } from "../model/event";

import User from "../model/user";
import Order from "../model/order";

import { FilterQuery } from "mongoose";
dotenv.config();
<<<<<<< HEAD
const ai = new GoogleGenerativeAI(process.env.GEMINI || "");
=======
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe

export class ChatRepository implements IChatRepository {
  async createChat(
    userMessage: string,
    userId: string
  ): Promise<GeminiResponse> {
    try {
      let relevantData = "No system data needed for this question.";

      if (userMessage.toLowerCase().includes("tickets")) {
        const match = userMessage.match(/for (.+)/i);
        const eventName = match ? match[1].trim() : "";

        if (eventName) {
          const event = await EventModel.findOne({
            title: { $regex: new RegExp(`^${eventName}$`, "i") },
          });

          if (event) {
            const ticketsSold = event.ticketsSold;
            relevantData = `The event "${event.title}" has sold ${ticketsSold} tickets.`;
          } else {
            relevantData = `No event found by the name "${eventName}".`;
          }
        }
      }

      // Events info by city
      else if (userMessage.toLowerCase().includes("events")) {
        const match = userMessage.match(/in (.+)/i);

        let city = match ? match[1].trim() : "";
        city = city.replace(/[?.!,]+$/, "");

        const events = await EventModel.find({
          venue: { $regex: new RegExp(city, "i") },
        });
        relevantData =
          events.length > 0
            ? `Found events in ${city}: ${events
                .map((v) => v.title)
                .join(", ")}.`
            : `No events found in ${city}.`;
      }

      // User profile
      else if (userMessage.toLowerCase().includes("profile")) {
        const user = await User.findById(userId);
        if (user) {
          relevantData = `Name: ${user.name}, Email: ${user.email}, Location: ${user.location}`;
        }
      }

      // Orders (simplified)
      else if (userMessage.toLowerCase().includes("orders")) {
        const orders = await Order.find({ userId });
        relevantData = `You have placed ${orders.length} orders.`;
      } else if (userMessage.toLowerCase().includes("trending")) {
        const topEvent = await EventModel.findOne({})
          .sort({ ticketsSold: -1 })
          .limit(1);

        relevantData = topEvent
          ? `The most trending event right now is "${topEvent.title}" with ${topEvent.ticketsSold} tickets sold.`
          : `No trending events found.`;
      } else if (userMessage.toLowerCase().includes("events on")) {
        const match = userMessage.match(/events on (\d{4}-\d{2}-\d{2})/i);
        const dateStr = match ? match[1] : "";

        if (dateStr) {
          const date = new Date(dateStr);
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          const categories = [
            "music",
            "sports",
            "arts",
            "technology",
            "others",
          ];
          const foundCategory = categories.find((cat) =>
            userMessage.toLowerCase().includes(cat)
          );
          const query: FilterQuery<IEvent> = {
            date: { $gte: date, $lt: nextDay },
          };
          if (foundCategory) {
            query.category = { $regex: new RegExp(`^${foundCategory}$`, "i") };
          }

          const events = await EventModel.find(query);
          const uniqueTitles = [...new Set(events.map((e) => e.title))];
          relevantData =
            events.length > 0
              ? foundCategory
                ? `Here are ${foundCategory} events on ${dateStr}: ${uniqueTitles.join(
                    ", "
                  )}.`
                : `Here are all events on ${dateStr}: ${uniqueTitles.join(
                    ", "
                  )}.`
              : `No ${
                  foundCategory ? foundCategory + " " : ""
                }events found on ${dateStr}.`;
        }
      }

<<<<<<< HEAD
      
const prompt = `
=======
      const prompt = `
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
You are an assistant for an Event Management System.

User asked: "${userMessage}"

System Data:
${relevantData}

<<<<<<< HEAD
Your task:
- Always respond only in bullet points.
- Each bullet should be short, clear, and easy to scan.
- Do not use long paragraphs.
- If there is no relevant data, still respond politely with a single bullet point saying "No relevant information found."
- Keep the tone friendly and helpful.
`;


=======
Respond clearly, helpfully, and friendly.
`;

>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const responseText =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return { text: responseText };
    } catch (error) {
      console.error("Gemini error:", error);
      return {
        text: "Oops! Something went wrong while generating the response.",
      };
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
