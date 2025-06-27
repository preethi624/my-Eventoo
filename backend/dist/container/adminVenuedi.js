"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVenueController = void 0;
const adminVenueRepository_1 = require("../repositories/adminVenueRepository");
const adminVenueService_1 = require("../services/adminVenueService");
const adminVenueController_1 = require("../controllers/adminVenueController");
const adminVenueRepository = new adminVenueRepository_1.AdminVenueRepository();
const adminVenueService = new adminVenueService_1.AdminVenueService(adminVenueRepository);
exports.adminVenueController = new adminVenueController_1.AdminVenueController(adminVenueService);
//# sourceMappingURL=adminVenuedi.js.map