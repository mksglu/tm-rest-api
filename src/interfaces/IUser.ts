import { Document } from "mongoose";
export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  accounts: string[];
  role: string;
  roles: {};
  email: string;
  password: string;
  dateCreated: Date;
  defaultAccount: string;
  mailConfirm: string;
  state: number;
  _id: string;
  accountName: string;
}
