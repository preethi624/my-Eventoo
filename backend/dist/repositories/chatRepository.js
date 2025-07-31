"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const event_1 = __importDefault(require("../model/event"));
const user_1 = __importDefault(require("../model/user"));
const order_1 = __importDefault(require("../model/order"));
dotenv_1.default.config();
const ai = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
class ChatRepository {
    createChat(userMessage, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                let relevantData = "No system data needed for this question.";
                if (userMessage.toLowerCase().includes("tickets")) {
                    const match = userMessage.match(/for (.+)/i);
                    const eventName = match ? match[1].trim() : "";
                    if (eventName) {
                        const event = yield event_1.default.findOne({
                            title: { $regex: new RegExp(`^${eventName}$`, 'i') }
                        });
                        if (event) {
                            const ticketsSold = event.ticketsSold;
                            relevantData = `The event "${event.title}" has sold ${ticketsSold} tickets.`;
                        }
                        else {
                            relevantData = `No event found by the name "${eventName}".`;
                        }
                    }
                }
                // Events info by city
                else if (userMessage.toLowerCase().includes("events")) {
                    const match = userMessage.match(/in (.+)/i);
                    let city = match ? match[1].trim() : "";
                    city = city.replace(/[?.!,]+$/, "");
                    const events = yield event_1.default.find({ venue: { $regex: new RegExp(city, "i") } });
                    relevantData =
                        events.length > 0
                            ? `Found events in ${city}: ${events.map((v) => v.title).join(", ")}.`
                            : `No events found in ${city}.`;
                }
                // User profile
                else if (userMessage.toLowerCase().includes("profile")) {
                    const user = yield user_1.default.findById(userId);
                    if (user) {
                        relevantData = `Name: ${user.name}, Email: ${user.email}, Location: ${user.location}`;
                    }
                }
                // Orders (simplified)
                else if (userMessage.toLowerCase().includes("orders")) {
                    const orders = yield order_1.default.find({ userId });
                    relevantData = `You have placed ${orders.length} orders.`;
                }
                else if (userMessage.toLowerCase().includes("trending")) {
                    const topEvent = yield event_1.default.findOne({})
                        .sort({ ticketsSold: -1 })
                        .limit(1);
                    relevantData = topEvent
                        ? `The most trending event right now is "${topEvent.title}" with ${topEvent.ticketsSold} tickets sold.`
                        : `No trending events found.`;
                }
                else if (userMessage.toLowerCase().includes("events on")) {
                    const match = userMessage.match(/events on (\d{4}-\d{2}-\d{2})/i);
                    const dateStr = match ? match[1] : "";
                    if (dateStr) {
                        const date = new Date(dateStr);
                        const nextDay = new Date(date);
                        nextDay.setDate(date.getDate() + 1);
                        const categories = ["music", "sports", "arts", "technology", "others"];
                        const foundCategory = categories.find(cat => userMessage.toLowerCase().includes(cat));
                        const query = {
                            date: { $gte: date, $lt: nextDay }
                        };
                        if (foundCategory) {
                            query.category = { $regex: new RegExp(`^${foundCategory}$`, "i") };
                        }
                        const events = yield event_1.default.find(query);
                        const uniqueTitles = [...new Set(events.map(e => e.title))];
                        relevantData =
                            events.length > 0
                                ? foundCategory
                                    ? `Here are ${foundCategory} events on ${dateStr}: ${uniqueTitles.join(", ")}.`
                                    : `Here are all events on ${dateStr}: ${uniqueTitles.join(", ")}.`
                                : `No ${foundCategory ? foundCategory + " " : ""}events found on ${dateStr}.`;
                    }
                }
                const prompt = `
You are an assistant for an Event Management System.

User asked: "${userMessage}"

System Data:
${relevantData}

Respond clearly, helpfully, and friendly.
`;
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = yield model.generateContent({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                });
                const responseText = ((_f = (_e = (_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || "";
                return { text: responseText };
            }
            catch (error) {
                console.error("Gemini error:", error);
                return { text: "Oops! Something went wrong while generating the response." };
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chatRepository.js.map