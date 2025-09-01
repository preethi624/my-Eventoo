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
const order_1 = __importDefault(require("../model/order"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function backfillBookingNumbers() {
    return __awaiter(this, void 0, void 0, function* () {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';
        yield mongoose_1.default.connect(MONGO_URI);
        const orderIdsToDelete = ["ORD-20250829-2956", "ORD-20250829-6844"];
        yield order_1.default.deleteMany({ orderId: { $in: orderIdsToDelete } });
        console.log("Deleted orders with orderIds:", orderIdsToDelete);
        process.exit(0);
    });
}
backfillBookingNumbers();
//# sourceMappingURL=backBook.js.map