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
exports.AdminVenueController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
class AdminVenueController {
    constructor(adminVenueService) {
        this.adminVenueService = adminVenueService;
    }
    createVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                const venueData = Object.assign(Object.assign({}, req.body), { images: (files === null || files === void 0 ? void 0 : files.map((file) => file.path)) || [] });
                console.log("venue", venueData);
                const response = yield this.adminVenueService.venueCreate(venueData);
                if (response.success) {
                    res.json({ success: true, message: "venue created successfully" });
                }
                else {
                    res.json({ success: false, message: "Failed to create event" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to create event",
                });
            }
        });
    }
    fetchVenues(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const filters = {
                    searchTerm: typeof query.searchTerm === 'string' ? query.searchTerm : '',
                    page: query.page ? Number(query.page) : undefined,
                    limit: query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : undefined
                };
                const response = yield this.adminVenueService.venuesFetch(filters);
                if (response.success) {
                    res.json({ successs: true, message: "venues fetched successfully", venues: response.venues, totalPages: response.totalPages, currentPage: response.currentPage });
                }
                else {
                    res.json({ successs: false, message: "failed to fetch" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch venues",
                });
            }
        });
    }
    editVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = req.body;
                const response = yield this.adminVenueService.venueEdit(updateData);
                if (response.success) {
                    res.json({ successs: true, message: "venues updated successfully" });
                }
                else {
                    res.json({ successs: false, message: "failed to update" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to update",
                });
            }
        });
    }
    deleteVenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const venueId = req.params.venueId;
                const response = yield this.adminVenueService.venueDelete(venueId);
                if (response.success) {
                    res.json({ successs: true, message: "venues deleted successfully" });
                }
                else {
                    res.json({ successs: false, message: "failed to delete" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to delete",
                });
            }
        });
    }
}
exports.AdminVenueController = AdminVenueController;
//# sourceMappingURL=adminVenueController.js.map