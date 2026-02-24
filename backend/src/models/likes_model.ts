import mongoose from "mongoose";

export interface ILike {
    postId: string;
    userId: string;
    isLiked: boolean;
}

const likeSchema = new mongoose.Schema<ILike>({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    isLiked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// Ensure one like record per user per post
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const likeModel = mongoose.model<ILike>("Likes", likeSchema);
export default likeModel;