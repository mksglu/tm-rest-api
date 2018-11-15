import { Document } from "mongoose";

export default interface IAcccounts extends Document {
  _id: string;
  name: string;
  users: [];
}
