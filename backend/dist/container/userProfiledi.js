"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userController_1 = require("../controllers/userController");
const userRepository_1 = require("../repositories/userRepository");
const userService_1 = require("../services/userService");
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
exports.userController = new userController_1.UserController(userService);
//# sourceMappingURL=userProfiledi.js.map