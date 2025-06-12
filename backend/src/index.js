"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const userAuthRoutes_1 = __importDefault(require("./routes/userAuthRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
//import refreshRoutes from './routes/refreshRoutes';
// Load .env variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
// Static Files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', userAuthRoutes_1.default);
//app.use('/api/user',userRoutes );
//app.use('/api/admin', adminRoutes);
//app.use('/api/user', refreshRoutes); 
// Start Server
const PORT = process.env.PORT || 3000;
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('DB connection failed:', err);
});
