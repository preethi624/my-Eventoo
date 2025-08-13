"use strict";
// backend/constants/messages.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = void 0;
exports.MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: "Login successful",
        LOGIN_FAILED: "Invalid email or password",
        UNAUTHORIZED: "You are not authorized",
    },
    USER: {
        CREATED: "User created successfully",
        EXISTS: "User already exists",
        NOT_FOUND: "User not found",
    },
    ORGANISER: {
        CREATED: "Organiser created successfully",
        EXISTS: "Organiser already exists",
        NOT_FOUND: "Organiser not found",
    },
    COMMON: {
        SERVER_ERROR: "Internal server error",
        NOT_FOUND: "Resource not found",
        BAD_REQUEST: "Bad request",
    },
    EVENT: {
        FAILED_TO_CREATE: "Failed to create ",
        SUCCESS_TO_CREATE: "Successfully created ",
        FAILED_TO_FETCH: "Failed to fetch ",
        SUCCESS_TO_FETCH: "Fetched successfully",
        SUCCESS_TO_UPDATE: "Successfully updated",
        FAILED_TO_UPDATE: "Failed to update",
        FAILED_TO_DELETE: "Failed to delete",
        SUCCESS_TO_DELETE: "Successfully deleted"
    },
    CHAT: {
        FAILED_CHAT: "Failed to chat",
        SUCCESS_CHAT: "Chat successfully"
    }
};
//# sourceMappingURL=messages.js.map