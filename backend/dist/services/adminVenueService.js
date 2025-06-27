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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminVenueService = void 0;
class AdminVenueService {
    constructor(adminVenueRepository) {
        this.adminVenueRepository = adminVenueRepository;
    }
    venueCreate(venueData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminVenueRepository.createVenue(venueData);
                if (result) {
                    return { success: true, message: "Venue created successfully" };
                }
                else {
                    return { success: false, message: "Failed t create venue" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not creating venue" };
            }
        });
    }
    venuesFetch(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminVenueRepository.fetchVenues(filters);
                if (response) {
                    return { success: true, message: "fetched successfully", venues: response.venues, totalPages: response.totalPages, currentPage: response.currentPage };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch venues" };
            }
        });
    }
    venueEdit(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminVenueRepository.editVenue(updateData);
                if (response) {
                    return { success: true, message: "updated successfully" };
                }
                else {
                    return { success: false, message: "failed to update" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to update" };
            }
        });
    }
    venueDelete(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminVenueRepository.deleteVenue(venueId);
                if (response.acknowledged && response.deletedCount === 1) {
                    return { success: true, message: "deleted successfully" };
                }
                else {
                    return { success: false, message: "failed to delete" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to delete" };
            }
        });
    }
}
exports.AdminVenueService = AdminVenueService;
//# sourceMappingURL=adminVenueService.js.map