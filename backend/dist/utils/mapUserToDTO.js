"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserToDTO = void 0;
const mapUserToDTO = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    isBlocked: user.isBlocked,
});
exports.mapUserToDTO = mapUserToDTO;
//# sourceMappingURL=mapUserToDTO.js.map