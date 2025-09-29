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
exports.AdminUserRepository = void 0;
const user_1 = __importDefault(require("../model/user"));
<<<<<<< HEAD
const notification_1 = __importDefault(require("../model/notification"));
class AdminUserRepository {
    getUserAll(limit, page, searchTerm, filterStatus, sortBy) {
=======
class AdminUserRepository {
    getUserAll(limit, page, searchTerm, filterStatus) {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (searchTerm) {
                query.$or = [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } }
                ];
            }
            if (filterStatus === "blocked") {
                query.isBlocked = true;
            }
            else if (filterStatus === "unblocked") {
                query.isBlocked = false;
            }
            const skip = (page - 1) * limit;
<<<<<<< HEAD
            const users = yield user_1.default.find(query).sort(sortBy === "newest" ? { createdAt: -1 } :
                sortBy === "oldest" ? { createdAt: 1 } :
                    sortBy === "nameAsc" ? { name: 1 } : { name: -1 }).skip(skip).limit(limit).lean();
=======
            const users = yield user_1.default.find(query).skip(skip).limit(limit).lean();
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            const totalUser = yield user_1.default.countDocuments();
            const total = totalUser / limit;
            return { users, total };
        });
    }
    editUser(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
<<<<<<< HEAD
            try {
                const user = yield user_1.default.findByIdAndUpdate(id, formData, { new: true });
                yield notification_1.default.create({
                    userId: id,
                    type: "general",
                    message: `Your Eventoo acount is edited by admin !`,
                    isRead: false
                });
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
=======
            return yield user_1.default.findByIdAndUpdate(id, formData, { new: true });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
        });
    }
    blockUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = user._id;
            if (!user.isBlocked) {
<<<<<<< HEAD
                const user = yield user_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
                yield notification_1.default.create({
                    userId: id,
                    type: "general",
                    message: `Your Eventoo acount is blocked by admin !`,
                    isRead: false
                });
                return user;
            }
            else {
                const user = yield user_1.default.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
                yield notification_1.default.create({
                    userId: id,
                    type: "general",
                    message: `Your Eventoo acount is unblocked by admin !`,
                    isRead: false
                });
                return user;
=======
                return yield user_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
            }
            else {
                return yield user_1.default.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
            }
        });
    }
    getDashboardUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_1.default.aggregate([
                { $group: { _id: { $month: "$createdAt" }, totalUsers: { $sum: 1 } } },
                { $project: { month: "$_id", totalUsers: 1, _id: 0 } },
                { $sort: { month: 1 } },
            ]);
            const totalUsers = yield user_1.default.find({ isBlocked: false });
            return { data, totalUsers: totalUsers.length };
        });
    }
}
exports.AdminUserRepository = AdminUserRepository;
//# sourceMappingURL=adminUserRepository.js.map