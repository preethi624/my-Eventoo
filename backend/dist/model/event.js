"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= new Date(new Date().setHours(0, 0, 0, 0));
            },
            message: 'Event date must be today or in the future.',
        },
    },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    capacity: { type: Number, required: true },
    images: { type: [String], default: [] },
    organiser: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'organiser' },
    status: {
        type: String,
        enum: ['draft', 'published', 'completed', 'cancelled'],
        default: 'draft',
    },
    availableTickets: { type: Number, default: 0 },
    ticketsSold: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    latitude: { type: Number, default: 9.9312 },
    longitude: { type: Number, default: 76.2673 },
    isBlocked: { type: Boolean, default: false },
});
eventSchema.pre('save', function (next) {
    if (this.isNew) {
        this.availableTickets = this.capacity;
    }
    next();
});
const EventModel = mongoose_1.default.model('Event', eventSchema);
exports.default = EventModel;
//# sourceMappingURL=event.js.map