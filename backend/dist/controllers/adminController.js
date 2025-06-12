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
exports.AdminController = void 0;
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.getUsers();
                if (result.success) {
                    res.json({ result: result.result, message: result.message, success: true });
                }
                else {
                    res.json({ message: result.message, success: false });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const formData = req.body;
                const result = yield this.adminService.userUpdate(id, formData);
                if (result.success) {
                    res.json({ success: true, message: "edited successfully" });
                    return;
                }
                else {
                    res.json({ success: false, message: "failed to edit" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const result = yield this.adminService.userBlock(user);
                if (result.success) {
                    res.json({ success: true, message: "User blocked successfully" });
                }
                else {
                    res.json({ success: false, message: "failed to block" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map