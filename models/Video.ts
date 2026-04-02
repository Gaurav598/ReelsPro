import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Owner of the video
  title: string;
  description?: string; // Opt
  videoUrl: string;
  videoFileId?: string; // Used to delete from ImageKit
  thumbnailUrl?: string; // Opt
  thumbnailFileId?: string; // Used to delete from ImageKit
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
const videoSchema = new Schema<IVideo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: false },
    videoUrl: { type: String, required: true },
    videoFileId: { type: String, required: false },
    thumbnailUrl: { type: String, required: false },
    thumbnailFileId: { type: String, required: false },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
