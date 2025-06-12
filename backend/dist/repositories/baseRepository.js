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
exports.BaseRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, data, { new: true });
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(id);
            return yield this.model.deleteOne({ _id: objectId });
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter).exec();
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepository.js.map