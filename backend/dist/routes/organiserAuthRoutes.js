"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orgAuthdi_1 = require("../container/orgAuthdi");
const router = express_1.default.Router();
router.post("/organiser/login", orgAuthdi_1.authController.organiserLogin.bind(orgAuthdi_1.authController));
router.post("/organiser/register", orgAuthdi_1.authController.organiserRegister.bind(orgAuthdi_1.authController));
router.post("/organiser/otp", orgAuthdi_1.authController.organiserVerify.bind(orgAuthdi_1.authController));
router.post("/organiser/resendOtp", orgAuthdi_1.authController.organiserResend.bind(orgAuthdi_1.authController));
router.post("/google/organiser", orgAuthdi_1.authController.googleOrganiserLogin.bind(orgAuthdi_1.authController));
exports.default = router;
//# sourceMappingURL=organiserAuthRoutes.js.map