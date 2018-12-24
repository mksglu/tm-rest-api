import { Document } from "mongoose";

export default interface ILogs extends Document {
  _id: string;
  logMessage: string;
}
