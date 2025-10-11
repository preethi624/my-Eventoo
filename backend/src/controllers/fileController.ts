import mongoose from "mongoose";
const { GridFSBucket, ObjectId } = mongoose.mongo;
import { Request, Response } from "express";

export class FileController {
  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const db = mongoose.connection.db; 
      if (!db) {
  throw new Error("MongoDB connection not ready");
}
      const bucket = new GridFSBucket(db, { bucketName: "files" });
      const fileId = new ObjectId(req.params.id);

      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.pipe(res);

      downloadStream.on("error", () => res.status(404).send("File not found"));
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching file");
    }
  }
}
