"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_1 = __importDefault(require("../model/admin"));
const MONGODB_URI = 'mongodb://127.0.0.1:27017/eventDB';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield bcrypt_1.default.hash('admin123', 10);
            const adminData = {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
            };
            const admin = yield admin_1.default.create(adminData);
            console.log('Admin created successfully:', admin);
        }
        catch (error) {
            console.error('Error creating admin:', error);
        }
        finally {
            mongoose_1.default.connection.close();
        }
    });
}
createAdmin();
//# sourceMappingURL=createAdmin.js.map