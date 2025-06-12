"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEventController = void 0;
const adminEventController_1 = require("../controllers/adminEventController");
const adminEventRepository_1 = require("../repositories/adminEventRepository");
const adminEventService_1 = require("../services/adminEventService");
const adminEventRepository = new adminEventRepository_1.AdminEventRepository();
const adminEventService = new adminEventService_1.AdminEventService(adminEventRepository);
exports.adminEventController = new adminEventController_1.AdminEventController(adminEventService);
//# sourceMappingURL=adminEventdi.js.map