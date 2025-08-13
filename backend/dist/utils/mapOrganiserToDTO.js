"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOrganiserToDTO = void 0;
const mapOrganiserToDTO = (organiser) => ({
    _id: organiser._id,
    name: organiser.name,
    email: organiser.email,
    isBlocked: organiser.isBlocked,
    status: organiser.status,
});
exports.mapOrganiserToDTO = mapOrganiserToDTO;
//# sourceMappingURL=mapOrganiserToDTO.js.map