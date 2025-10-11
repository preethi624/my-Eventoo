"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_di_1 = require("../../container/middleware.di");
const userProfiledi_1 = require("../../container/userProfiledi");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.get("/user", middleware_di_1.authMiddlewarwSet.userOnly, userProfiledi_1.userController.getUser.bind(userProfiledi_1.userController));
router.put("/user", middleware_di_1.authMiddlewarwSet.userOnly, upload.single("image"), userProfiledi_1.userController.updateUser.bind(userProfiledi_1.userController));
router.get("/orgs", middleware_di_1.authMiddlewarwSet.userOnly, userProfiledi_1.userController.getOrgs.bind(userProfiledi_1.userController));
router.put('/', middleware_di_1.authMiddlewarwSet.userOnly, userProfiledi_1.userController.changePassword.bind(userProfiledi_1.userController));
router.get("/venues", middleware_di_1.authMiddlewarwSet.userOnly, userProfiledi_1.userController.fetchVenues.bind(userProfiledi_1.userController));
exports.default = router;
//# sourceMappingURL=profileRoutes.js.map