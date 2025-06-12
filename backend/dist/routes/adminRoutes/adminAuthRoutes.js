"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthdi_1 = require("../../container/adminAuthdi");
const router = express_1.default.Router();
router.post('/admin/login', adminAuthdi_1.adminAuthController.adminLogin.bind(adminAuthdi_1.adminAuthController));
exports.default = router;
//# sourceMappingURL=adminAuthRoutes.js.map