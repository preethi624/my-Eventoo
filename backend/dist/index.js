"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketMap_1 = require("./socketMap");
//import refreshRoutes from './routes/refreshRoutes';
// Load .env variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
// Static Files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', userAuthRoutes_1.default);
app.use('/api/auth', organiserAuthRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/event', eventRoutes_1.default);
app.use('/api/event', eventOrgRoutes_1.default);
app.use('/api/organiser', organiserRoutes_1.default);
app.use('/api/user', profileRoutes_1.default);
app.use('/api/admin', adminAuthRoutes_1.default);
app.use('/api/admin', adminUserRoutes_1.default);
app.use('/api/admin', adminEventRoutes_1.default);
app.use('/api/admin', adminOrganiserRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
exports.io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('register-user', (userId) => {
        socketMap_1.userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });
    socket.on('register-organiser', (organiserId) => {
        socketMap_1.organiserSocketMap.set(organiserId, socket.id);
        console.log(`Organiser ${organiserId} registered with socket ${socket.id}`);
    });
    socket.on('disconnect', () => {
        for (const [userId, sId] of socketMap_1.userSocketMap.entries()) {
            if (sId === socket.id) {
                socketMap_1.userSocketMap.delete(userId);
                break;
            }
        }
        for (const [orgId, sId] of socketMap_1.organiserSocketMap.entries()) {
            if (sId === socket.id) {
                socketMap_1.organiserSocketMap.delete(orgId);
                console.log(`Organiser ${orgId} disconnected and removed from map`);
                break;
            }
        }
        console.log('Client disconnected:', socket.id);
    });
});
// Start Server
const PORT = process.env.PORT || 3000;
(0, db_1.default)()
    .then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('DB connection failed:', err);
});
//# sourceMappingURL=index.js.map