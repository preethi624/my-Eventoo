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
dotenv_1.default.config();
const ai = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
class ChatRepository {
    createChat(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const promptString = typeof prompt === "string" ? prompt : JSON.stringify(prompt);
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = yield model.generateContent({ contents: [
                        {
                            role: "user",
                            parts: [
                                { text: promptString }
                            ]
                        }
                    ] });
                const responseText = ((_f = (_e = (_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) || "";
                return {
                    text: responseText
                };
            }
            catch (error) {
                console.error("Error generating Gemini response:", error);
                if (typeof error === "object" && error !== null && "status" in error) {
                    if (error.status === 429) {
                        console.warn("Gemini API quota exceeded. Please try again later.");
                        return { text: "I'm currently experiencing a high volume of requests. Please try again in a minute!" };
                    }
                }
                throw new Error("Failed to generate response");
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chatRepository.js.map