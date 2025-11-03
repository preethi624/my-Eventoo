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
exports.MessageRepository = void 0;
const message_1 = require("../model/message");
const mongodb_1 = require("mongodb");
class MessageRepository {
    constructor(client) {
        this.db = client.db("eventDB");
    }
    saveMessage(senderId, receiverId, message, isOrganiser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_1.MessageModel.create({
                senderId,
                receiverId,
                message,
                isOrganiser,
                timestamp: new Date(),
            });
        });
    }
    getMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield message_1.MessageModel.find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            }).sort({ timestamp: 1 });
        });
    }
    saveFileToStorage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = new mongodb_1.GridFSBucket(this.db, { bucketName: "files" });
            return new Promise((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(file.originalname);
                uploadStream.end(file.buffer);
                uploadStream.on("finish", () => {
                    resolve(`/files/${uploadStream.id}`);
                });
                uploadStream.on("error", (err) => {
                    reject(err);
                });
            });
        });
    }
}
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=messageRepository.js.map