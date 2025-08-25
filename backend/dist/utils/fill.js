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
const mongoose_1 = __importDefault(require("mongoose"));
const event_1 = __importDefault(require("../model/event"));
const backFill_1 = require("./backFill");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!MONGO_URI) {
            throw Error("MONGO_URI not exist");
        }
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
        updateEventCordinates();
    }
    catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
});
connectDB();
function updateEventCordinates() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield event_1.default.find();
        console.log("events", events);
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        for (const event of events) {
            const coords = yield (0, backFill_1.getCoordinates)(event.venue);
            if (coords) {
                yield event_1.default.updateOne({ _id: event._id }, { $set: { latitude: coords.lat, longitude: coords.lon } });
                console.log(`✅ Updated ${event.title} with lat=${coords.lat}, lon=${coords.lon}`);
                yield delay(1000);
            }
        }
    });
}
//# sourceMappingURL=fill.js.map