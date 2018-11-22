import { IFolders } from "interfaces";
import { Model, model, Schema } from "mongoose";
export const FoldersSchema: Schema = new Schema(
  {
    _id: { required: true, type: String },
    accountId: { required: true, type: String },
    parentId: { required: false, type: String, default: null },
    name: { required: true, type: String },
    folderType: { required: true, type: String }
  },
  { timestamps: { createdAt: "created_at" } }
);
export default model<IFolders>("Folders", FoldersSchema) as Model<IFolders>;
