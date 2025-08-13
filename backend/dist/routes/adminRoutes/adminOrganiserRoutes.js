"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const adminOrganiserdi_1 = require("../../container/adminOrganiserdi");
const router = express_1.default.Router();
router.get("/organisers", middleware_di_1.authMiddlewarwSet.adminOnly, adminOrganiserdi_1.adminOrgController.getAllOrganisers.bind(adminOrganiserdi_1.adminOrgController));
router.put("/organiser/:id", middleware_di_1.authMiddlewarwSet.adminOnly, adminOrganiserdi_1.adminOrgController.updateOrganiser.bind(adminOrganiserdi_1.adminOrgController));
router.put("/organiser", middleware_di_1.authMiddlewarwSet.adminOnly, adminOrganiserdi_1.adminOrgController.blockOrganiser.bind(adminOrganiserdi_1.adminOrgController));
exports.default = router;
//# sourceMappingURL=adminOrganiserRoutes.js.map