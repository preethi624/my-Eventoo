"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrgController = void 0;
const mailService_1 = require("../services/mailService");
const adminOrgController_1 = require("../controllers/adminOrgController");
const adminOrgRepository_1 = require("../repositories/adminOrgRepository");
const AdminOrgService_1 = require("../services/AdminOrgService");
const adminOrgRepository = new adminOrgRepository_1.AdminOrgRepository();
const mailService = new mailService_1.MailService();
const adminOrgService = new AdminOrgService_1.AdminOrgService(adminOrgRepository, mailService);
exports.adminOrgController = new adminOrgController_1.AdminOrgController(adminOrgService);
//# sourceMappingURL=adminOrganiserdi.js.map