import { NextFunction } from "express";
import { IUser } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const UserSchema: Schema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String, select: false },
  dateCreated: { type: Date, default: Date.now },
  defaultAccount: { required: false, type: String },
  mailConfirm: { required: true, type: String },
  state: { required: true, type: Number },
  _id: { required: true, type: String }
});
UserSchema.pre("update", (next: NextFunction) => {
  // const password = this.getUpdate().$set.password;
  // console.log(password);
});

export default model<IUser>("Users", UserSchema) as Model<IUser>;
