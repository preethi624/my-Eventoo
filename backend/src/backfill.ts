import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { IEventDTO } from "./interface/IEventDTO";
import EventModel, { IEvent } from "./model/event";


// Configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface IEventImage {
  url: string;
  public_id?: string;
}

const backfillImages = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';
  await mongoose.connect(MONGO_URI);

  const events: IEvent[] = await EventModel.find({});

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
      const result = await cloudinary.v2.uploader.upload(imageUrl, {
        folder: "Events"
      });

      event.images[i] = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      updated = true;
    } catch (error) {
      console.error("Upload failed for", imageUrl, error);
    }
  }
}


      if (updated) {
        await event.save();
        console.log(`Updated event ${event._id}`);
      }
    }
  }

  console.log("Backfill completed ✅");
  process.exit(0);
};

backfillImages();
