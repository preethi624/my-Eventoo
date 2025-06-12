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
exports.OrganiserRepository = void 0;
const organiser_1 = __importDefault(require("../model/organiser"));
const order_1 = __importDefault(require("../model/order"));
class OrganiserRepository {
    getOrganiserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findById(id);
        });
    }
    statusCheck(emailObj) {
        return __awaiter(this, void 0, void 0, function* () {
            ;
            const { email } = emailObj;
            return yield organiser_1.default.findOne({ email });
        });
    }
    updateOrganiser(data, organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, location, aboutMe, profileImage } = data;
            return yield organiser_1.default.findByIdAndUpdate(organiserId, { name, phone, location, aboutMe: aboutMe, profileImage }, { new: true });
        });
    }
    fetchBooking(organiserId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const allOrders = yield order_1.default.find().populate({
                path: 'eventId',
                select: 'title organiser ticketPrice'
            });
            const filteredOrder = allOrders.filter((order) => {
                const event = order.eventId;
                return event && event.organiser && event.organiser.toString() === organiserId;
            });
            const totalOrders = filteredOrder.length;
            const paginatedOrders = filteredOrder.slice(skip, skip + limit);
            const totalPages = Math.ceil(totalOrders / limit);
            return {
                result: paginatedOrders,
                totalPages,
                currentPage: page
            };
        });
    }
    getOrderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("orderId", orderId);
            const cleanOrderId = orderId.replace(/^:/, '');
            return yield order_1.default.findOne({ _id: cleanOrderId }).populate('eventId');
        });
    }
    orgReapply(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findByIdAndUpdate(organiserId, { status: "pending" }, { new: true });
        });
    }
}
exports.OrganiserRepository = OrganiserRepository;
//# sourceMappingURL=organiserRepository.js.map