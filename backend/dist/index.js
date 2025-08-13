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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const node_cron_1 = __importDefault(require("node-cron"));
const userAuthRoutes_1 = __importDefault(require("./routes/userAuthRoutes"));
const organiserAuthRoutes_1 = __importDefault(require("./routes/organiserAuthRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/userRoutes/eventRoutes"));
const eventOrgRoutes_1 = __importDefault(require("./routes/organiserRoutes/eventOrgRoutes"));
const organiserRoutes_1 = __importDefault(require("./routes/organiserRoutes/organiserRoutes"));
const adminAuthRoutes_1 = __importDefault(require("./routes/adminRoutes/adminAuthRoutes"));
const adminUserRoutes_1 = __importDefault(require("./routes/adminRoutes/adminUserRoutes"));
const adminEventRoutes_1 = __importDefault(require("./routes/adminRoutes/adminEventRoutes"));
const adminOrganiserRoutes_1 = __importDefault(require("./routes/adminRoutes/adminOrganiserRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/userRoutes/paymentRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/userRoutes/profileRoutes"));
const adminOrderRoutes_1 = __importDefault(require("./routes/adminRoutes/adminOrderRoutes"));
const adminVenueRoutes_1 = __importDefault(require("./routes/adminRoutes/adminVenueRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketMap_1 = require("./socketMap");
const updateCompletedEvents_1 = require("./job/updateCompletedEvents");
const messagedi_1 = require("./container/messagedi");
const logger_1 = __importDefault(require("./utils/logger"));
const morgan_1 = __importDefault(require("morgan"));
function broadcastOnlineUsers() {
    const onlineUsers = Array.from(socketMap_1.userSocketMap.keys());
    exports.io.emit("online-users", onlineUsers);
}
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
// Middleware
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.http(message.trim()),
    },
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
// Static Files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Routes
app.use("/api/auth", userAuthRoutes_1.default);
app.use("/api/auth", organiserAuthRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/category", categoryRoutes_1.default);
app.use("/api/event", eventRoutes_1.default);
app.use("/api/event", eventOrgRoutes_1.default);
app.use("/api/organiser", organiserRoutes_1.default);
app.use("/api/user", profileRoutes_1.default);
app.use("/api/admin", adminAuthRoutes_1.default);
app.use("/api/admin", adminUserRoutes_1.default);
app.use("/api/admin", adminEventRoutes_1.default);
app.use("/api/admin", adminOrganiserRoutes_1.default);
app.use("/api/admin", adminOrderRoutes_1.default);
app.use("/api/admin", adminVenueRoutes_1.default);
app.use("/api/payment", paymentRoutes_1.default);
app.use("/api/message", messageRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
exports.io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("register-user", (userId) => {
        socketMap_1.userSocketMap.set(userId, socket.id);
        logger_1.default.info(`User ${userId} registered with socket ${socket.id}`);
        broadcastOnlineUsers();
    });
    socket.on("register-organiser", (organiserId) => {
        socketMap_1.organiserSocketMap.set(organiserId, socket.id);
        logger_1.default.info(`Organiser ${organiserId} registered with socket ${socket.id}`);
        broadcastOnlineUsers();
    });
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, receiverId, message, isOrganiser } = data;
        const savedMessage = yield messagedi_1.messageService.handleIncomingMessage(senderId, receiverId, message, isOrganiser);
        const receiverSocketId = isOrganiser
            ? socketMap_1.userSocketMap.get(receiverId)
            : socketMap_1.organiserSocketMap.get(receiverId);
        if (receiverSocketId) {
            exports.io.to(receiverSocketId).emit("receive-message", savedMessage);
        }
    }));
    socket.on("disconnect", () => {
        for (const [userId, sId] of socketMap_1.userSocketMap.entries()) {
            if (sId === socket.id) {
                socketMap_1.userSocketMap.delete(userId);
                break;
            }
        }
        for (const [orgId, sId] of socketMap_1.organiserSocketMap.entries()) {
            if (sId === socket.id) {
                socketMap_1.organiserSocketMap.delete(orgId);
                logger_1.default.info(`Organiser ${orgId} disconnected and removed from map`);
                break;
            }
        }
        logger_1.default.info("Client disconnected:", socket.id);
        broadcastOnlineUsers();
    });
});
// Start Server
const PORT = process.env.PORT || 3000;
(0, db_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, updateCompletedEvents_1.updateCompletedEvents)();
    node_cron_1.default.schedule("0 0 * * *", updateCompletedEvents_1.updateCompletedEvents);
    httpServer.listen(PORT, () => {
        logger_1.default.info(`Server running at http://localhost:${PORT}`);
    });
}))
    .catch((err) => {
    logger_1.default.error("DB connection failed:", err);
});
//# sourceMappingURL=index.js.map