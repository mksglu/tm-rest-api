import { IUser } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const UserSchema: Schema = new Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String },
  password: { required: true, type: String },
  dateCreated: { type: Date, default: Date.now },
  defaultAccount: { required: false, type: String },
  mailConfirm: { required: true, type: String },
  state: { required: true, type: Number },
  _id: { required: true, type: String }
});

export default model<IUser>("Users", UserSchema) as Model<IUser>;
