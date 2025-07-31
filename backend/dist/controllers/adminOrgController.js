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
exports.AdminOrgController = void 0;
const statusCodeEnum_1 = require("../constants/statusCodeEnum");
const mapOrganiserToDTO_1 = require("../utils/mapOrganiserToDTO");
const socketMap_1 = require("../socketMap");
const index_1 = require("../index");
const messages_1 = require("../constants/messages");
class AdminOrgController {
    constructor(adminOrgService) {
        this.adminOrgService = adminOrgService;
    }
    getAllOrganisers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const result = yield this.adminOrgService.getOrganiser(limit, page);
                if (result.success && result.result) {
                    const mappedOrganisers = result.result.map(mapOrganiserToDTO_1.mapOrganiserToDTO);
                    res.json({ result: mappedOrganisers, message: result.message, success: true, total: result.total });
                }
                else {
                    res.json({ message: result.message, success: false });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    updateOrganiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const formData = req.body;
                const result = yield this.adminOrgService.organiserUpdate(id, formData);
                if (result.success) {
                    res.json({ success: true, message: "edited successfully" });
                    return;
                }
                else {
                    res.json({ success: false, message: "failed to edit" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
    blockOrganiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organiser = req.body;
                const organiserId = organiser._id;
                const result = yield this.adminOrgService.organiserBlock(organiser);
                if (result.success && result.organiser) {
                    if (result.organiser.isBlocked) {
                        const socketId = socketMap_1.organiserSocketMap.get(organiserId.toString());
                        if (socketId) {
                            index_1.io.to(socketId).emit('logout');
                            console.log(`Forced logout emitted for user ${organiserId}`);
                        }
                    }
                    res.json({ success: true, message: "Organiser blocked successfully" });
                }
                else {
                    res.json({ success: false, message: "failed to block" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(statusCodeEnum_1.StatusCode.INTERNAL_SERVER_ERROR).json({ message: messages_1.MESSAGES.COMMON.SERVER_ERROR });
            }
        });
    }
}
exports.AdminOrgController = AdminOrgController;
//# sourceMappingURL=adminOrgController.js.map