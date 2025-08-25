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
const event_1 = __importDefault(require("../model/event"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const inference_1 = require("@huggingface/inference");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';
const hf = new inference_1.InferenceClient(process.env.HUGGING_API_KEY);
function backfillEmbeddings() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield event_1.default.find({ embedding: { $exists: false } });
        for (const event of events) {
            const text = `${event.title} ${event.description} ${event.venue}`;
            const output = yield hf.featureExtraction({
                model: "sentence-transformers/all-MiniLM-L6-v2",
                inputs: text,
            });
            const embedding = Array.isArray(output[0]) ? output[0] : output;
            yield event_1.default.updateOne({ _id: event._id }, { $set: { embedding } });
            console.log(`Updated embedding for event: ${event.title}`);
        }
        console.log("✅ Backfill completed");
    });
}
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
        yield backfillEmbeddings();
    }
    catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
});
connectDB();
//# sourceMappingURL=backfillEmbeddings.js.map