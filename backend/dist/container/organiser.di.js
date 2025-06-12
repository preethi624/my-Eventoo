"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organiserController = void 0;
const organiserController_1 = require("../controllers/organiserController");
const organiserRepository_1 = require("../repositories/organiserRepository");
const organiserService_1 = require("../services/organiserService");
const organiserRepository = new organiserRepository_1.OrganiserRepository();
const organiserService = new organiserService_1.OrganiserService(organiserRepository);
exports.organiserController = new organiserController_1.OrganiserController(organiserService);
//# sourceMappingURL=organiser.di.js.map