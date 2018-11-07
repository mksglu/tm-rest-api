import { IUser } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const UserSchema: Schema = new Schema(
  {
    accounts: { type: Array, default: [] },
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String, select: false },
    defaultAccount: { required: false, type: String },
    mailConfirm: { required: true, type: String },
    state: { required: true, type: Number },
    _id: { required: true, type: String }
  },
  { timestamps: { createdAt: "created_at" } }
);

export default model<IUser>("Users", UserSchema) as Model<IUser>;
