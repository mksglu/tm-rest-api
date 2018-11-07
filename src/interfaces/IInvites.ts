import { Document } from "mongoose";

export default interface IInvites extends Document {
  _id: string;
  accountId: string;
  email: string;
  inviteHash: string;
  state: number;
}
