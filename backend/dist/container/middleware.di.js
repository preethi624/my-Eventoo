"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewarwSet = void 0;
const tokenService_1 = require("../services/tokenService");
const authMiddlewareFactory_1 = require("./authMiddlewareFactory");
const tokenService = new tokenService_1.TokenService();
exports.authMiddlewarwSet = (0, authMiddlewareFactory_1.authMiddlewareFactory)(tokenService);
//# sourceMappingURL=middleware.di.js.map