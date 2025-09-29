"use strict";
<<<<<<< HEAD
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
=======
Object.defineProperty(exports, "__esModule", { value: true });
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
const winston_1 = require("winston");
const isDev = process.env.NODE_ENV !== 'production';
const logger = (0, winston_1.createLogger)({
    level: isDev ? 'debug' : 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), ...(isDev ? [winston_1.format.colorize()] : []), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map