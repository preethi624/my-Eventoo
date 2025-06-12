"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewareFactory = void 0;
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authMiddlewareFactory = (tokenSevice) => {
    return {
        userOnly: (0, authMiddleware_1.default)(tokenSevice, ['user']),
        organiserOnly: (0, authMiddleware_1.default)(tokenSevice, ['organiser']),
        adminOnly: (0, authMiddleware_1.default)(tokenSevice, ['admin']),
        userAndOrganiser: (0, authMiddleware_1.default)(tokenSevice, ['user', 'organiser']),
    };
};
exports.authMiddlewareFactory = authMiddlewareFactory;
//# sourceMappingURL=authMiddlewareFactory.js.map