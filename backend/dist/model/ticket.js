"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = void 0;
// models/Ticket.ts
const mongoose_1 = __importDefault(require("mongoose"));
const ticketSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Order', required: true },
    eventId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Event', required: true },
    qrToken: { type: String, unique: true },
    issuedAt: { type: Date, default: Date.now },
    checkedIn: { type: Boolean, default: false }
});
exports.TicketModel = mongoose_1.default.model('Ticket', ticketSchema);
//# sourceMappingURL=ticket.js.map