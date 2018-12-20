import { ILogs } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const LogsSchema: Schema = new Schema(
  {
    logMessage: { type: String },
    _id: { required: true, type: String }
  },
  { timestamps: { createdAt: "created_at" } }
);
export default model<ILogs>("Logs", LogsSchema) as Model<ILogs>;
