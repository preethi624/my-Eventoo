"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonAuthRepository = void 0;
const organiserAuthRepository_1 = require("./organiserAuthRepository");
const userAuthRepository_1 = require("./userAuthRepository");
class CommonAuthRepository {
    static getRepository(userType) {
        if (userType === 'user')
            return new userAuthRepository_1.UserAuthRepository();
        return new organiserAuthRepository_1.OrganiserAuthRepository();
    }
}
exports.CommonAuthRepository = CommonAuthRepository;
//# sourceMappingURL=commonAuthRepository.js.map