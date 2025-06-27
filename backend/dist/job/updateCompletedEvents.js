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
exports.updateCompletedEvents = void 0;
const event_1 = __importDefault(require("../model/event"));
const updateCompletedEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    try {
        const result = yield event_1.default.updateMany({
            status: { $in: ['published'] },
            date: { $lt: now }
        }, {
            $set: { status: 'completed' }
        });
    }
    catch (error) {
        console.error(' Error updating completed events:', error);
    }
});
exports.updateCompletedEvents = updateCompletedEvents;
//# sourceMappingURL=updateCompletedEvents.js.map