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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrgService = void 0;
class AdminOrgService {
    constructor(adminOrgRepository, mailService) {
        this.adminOrgRepository = adminOrgRepository;
        this.mailService = mailService;
    }
    getOrganiser(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminOrgRepository.getOrganiserAll(limit, page);
                if (result) {
                    return { result: result.result, success: true, message: "Users fetched successfully", total: result.total };
                }
                else {
                    return { success: false, message: "failed to fetch users" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    organiserUpdate(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminOrgRepository.editOrganiser(id, formData);
                console.log("resee", formData);
                if (response) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: formData.email,
                        subject: 'Eventoo account status updated by admin',
                        text: ` Your Eventoo account ${formData.status} by admin`
                    };
                    this.mailService.sendMail(mailOptions);
                    //await transporter.sendMail(mailOptions);
                    return { success: true, message: "Organiser edit successfully" };
                }
                else {
                    return { success: false, message: "failed to edit organiser" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    organiserBlock(organiser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminOrgRepository.blockOrganiser(organiser);
                if (response) {
                    return { organiser: response, success: true, message: "Organiser blocked successfully" };
                }
                else {
                    return { success: false, message: "failed to block" };
                }
            }
            catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
}
exports.AdminOrgService = AdminOrgService;
//# sourceMappingURL=AdminOrgService.js.map