import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
  username: string;
  _id?: string;
  refreshToken?: string[];
  isVet?: boolean;
  imageName?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,   
    required: true,
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  isVet: {
    type: Boolean,
    required: true,
    default: false,
  },
  imageName:{
    type: String,
    required: false,
    default: "",
  }
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;