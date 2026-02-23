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

const likeModel = mongoose.model<ILike>("Likes", likeSchema);
export default likeModel;