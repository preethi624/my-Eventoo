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
exports.AdminOrgRepository = void 0;
const organiser_1 = __importDefault(require("../model/organiser"));
class AdminOrgRepository {
    getOrganiserAll(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const organisers = yield organiser_1.default.find().skip(skip).limit(limit);
            const totalOrganisers = yield organiser_1.default.countDocuments();
            const total = totalOrganisers / limit;
            return { result: organisers, total };
        });
    }
    editOrganiser(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organiser_1.default.findByIdAndUpdate(id, formData, { new: true });
        });
    }
    blockOrganiser(organiser) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = organiser._id;
            if (!organiser.isBlocked) {
                return yield organiser_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
            }
            else {
                return yield organiser_1.default.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
            }
        });
    }
}
exports.AdminOrgRepository = AdminOrgRepository;
//# sourceMappingURL=adminOrgRepository.js.map