import { IAcccounts } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const AccountsSchema: Schema = new Schema(
  {
    _id: { required: true, type: String },
    name: { required: true, type: String },
    users: { required: true, type: Array, default: [] }
  },
  { timestamps: { createdAt: "created_at" } }
);
export default model<IAcccounts>("Accounts", AccountsSchema) as Model<IAcccounts>;
