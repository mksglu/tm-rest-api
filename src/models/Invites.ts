import { IInvites } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const InvitesSchema: Schema = new Schema({
  email: { required: true, type: String, unique: true },
  dateCreated: { type: Date, default: Date.now },
  accountId: { type: String },
  inviteHash: { required: true, type: String },
  state: { required: true, type: Number },
  _id: { required: true, type: String }
});
export default model<IInvites>("Invites", InvitesSchema) as Model<IInvites>;
