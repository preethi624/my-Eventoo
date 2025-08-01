"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const eventRepository_1 = require("../repositories/eventRepository");
const paymentController_1 = require("../controllers/paymentController");
const paymentRepository_1 = require("../repositories/paymentRepository");
const paymentService_1 = require("../services/paymentService");
const paymentRepository = new paymentRepository_1.PaymentRepository();
const eventRepository = new eventRepository_1.EventRepository();
const paymentService = new paymentService_1.PaymentService(paymentRepository, eventRepository);
exports.paymentController = new paymentController_1.PaymentController(paymentService);
//# sourceMappingURL=userPaymentdi.js.map