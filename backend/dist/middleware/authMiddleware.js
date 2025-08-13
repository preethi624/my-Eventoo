"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (tokenService, allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ success: false, message: "No token provided" });
                return;
            }
            const token = authHeader.split(" ")[1];
            const decoded = tokenService.verifyAccessToken(token);
            req.user = decoded;
            const userRole = decoded.role;
            if (!allowedRoles.includes(userRole)) {
                res
                    .status(403)
                    .json({
                    success: false,
                    message: "Access denied: insufficient role",
                });
                return;
            }
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ success: false, message: "Token expired" });
                return;
            }
            res.status(403).json({ success: false, message: "Invalid token" });
            return;
        }
    };
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map