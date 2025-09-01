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
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const event_1 = __importDefault(require("./model/event"));
// Configure cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const backfillImages = () => __awaiter(void 0, void 0, void 0, function* () {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';
    yield mongoose_1.default.connect(MONGO_URI);
    const events = yield event_1.default.find({});
    for (const event of events) {
        if (event.images && event.images.length > 0) {
            let updated = false;
            /*for (let i = 0; i < event.images.length; i++) {
              const image = event.images[i] as IEventImage;
      
              // ✅ Only process if public_id is missing
              if (!image.public_id && image.url) {
                console.log(`Uploading old image for event ${event._id}: ${image.url}`);
      
                try {
                  // ✅ Ensure `url` is a string
                  const result = await cloudinary.v2.uploader.upload(image.url);
      
                  // ✅ Replace old image entry with new one
                  event.images[i] = {
                    url: result.secure_url,
                    public_id: result.public_id,
                  };
      
                  updated = true;
                } catch (error) {
                  console.error("Upload failed for", image.url, error);
                }
              }
            }*/
            for (let i = 0; i < event.images.length; i++) {
                const img = event.images[i];
                // Case 1: old string-only image
                const imageUrl = typeof img === "string" ? img : img.url;
                const publicId = typeof img === "string" ? undefined : img.public_id;
                if (!publicId && imageUrl) {
                    console.log(`Uploading old image for event ${event._id}: ${imageUrl}`);
                    try {
                        const result = yield cloudinary_1.default.v2.uploader.upload(imageUrl, {
                            folder: "Events"
                        });
                        event.images[i] = {
                            url: result.secure_url,
                            public_id: result.public_id,
                        };
                        updated = true;
                    }
                    catch (error) {
                        console.error("Upload failed for", imageUrl, error);
                    }
                }
            }
            if (updated) {
                yield event.save();
                console.log(`Updated event ${event._id}`);
            }
        }
    }
    console.log("Backfill completed ✅");
    process.exit(0);
});
backfillImages();
//# sourceMappingURL=backfill.js.map