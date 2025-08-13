import multer  from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Events",
        allowed_formats:["jpg", "jpeg", "png"],
    } as {
    folder: string;
    allowed_formats: string[];
  },
})
export const upload=multer({storage})