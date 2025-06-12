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
exports.OrganiserService = void 0;
class OrganiserService {
    constructor(organiserRepository) {
        this.organiserRepository = organiserRepository;
    }
    orgGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.getOrganiserById(id);
                if (result) {
                    return { result, success: true, message: "organiser fetched successfully" };
                }
                else {
                    return { success: false, message: "No organiser found" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "not getting event" };
            }
        });
    }
    statusCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.statusCheck(email);
                if (result) {
                    return { result: result, success: true };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false };
            }
        });
    }
    organiserUpdate(data, organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.updateOrganiser(data, organiserId);
                if (result) {
                    return { result: result, success: true, message: "user updated successfully" };
                }
                else {
                    return { success: false, message: "failed to update" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "failed to update" };
            }
        });
    }
    bookingFetch(organiserId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.fetchBooking(organiserId, limit, page);
                if (result) {
                    return { success: true, message: "orders fetched successfully", result: result.result, totalPages: result.totalPages, currentPage: result.currentPage };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    orderGetDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.getOrderDetails(orderId);
                console.log("fetch result", result);
                if (result) {
                    return { success: true, message: "orders fetched successfully", order: result };
                }
                else {
                    return { success: false, message: "failed to fetch" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to fetch orders" };
            }
        });
    }
    reapplyOrg(organiserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organiserRepository.orgReapply(organiserId);
                console.log("fetch result", result);
                if (result) {
                    return { success: true, message: "reapplied successfully" };
                }
                else {
                    return { success: false, message: "failed to reapply" };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "failed to reapply" };
            }
        });
    }
}
exports.OrganiserService = OrganiserService;
//# sourceMappingURL=organiserService.js.map