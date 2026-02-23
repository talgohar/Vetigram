import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  owner: mongoose.Types.ObjectId;
  imageName?: string;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  imageName: {
    type: String,
    required: false,
  },
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;