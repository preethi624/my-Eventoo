"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_di_1 = require("../../container/auth.di");
const router = express_1.default.Router();
router.post('/user/login', auth_di_1.authController.userLogin.bind(auth_di_1.authController));
exports.default = router;
