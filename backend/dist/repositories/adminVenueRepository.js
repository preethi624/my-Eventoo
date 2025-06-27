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
exports.AdminVenueRepository = void 0;
const venue_1 = __importDefault(require("../model/venue"));
class AdminVenueRepository {
    createVenue(venueData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("venueData", venueData);
            return yield venue_1.default.create(venueData);
        });
    }
    fetchVenues(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = filters.limit && filters.page ? (filters.page - 1) * filters.limit : 0;
            const query = {
                $or: [
                    { name: { $regex: filters.searchTerm, $options: 'i' } },
                    { city: { $regex: filters.searchTerm, $options: 'i' } },
                    { state: { $regex: filters.searchTerm, $options: 'i' } },
                ]
            };
            const venues = yield venue_1.default.find(query).skip(skip).limit(Number(filters.limit));
            const total = yield venue_1.default.countDocuments(query);
            return { venues, totalPages: filters.limit ? Math.ceil(total / filters.limit) : 0, currentPage: filters.page };
        });
    }
    editVenue(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield venue_1.default.findByIdAndUpdate(updateData._id, updateData, { new: true });
        });
    }
    deleteVenue(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield venue_1.default.deleteOne({ _id: venueId });
        });
    }
}
exports.AdminVenueRepository = AdminVenueRepository;
//# sourceMappingURL=adminVenueRepository.js.map