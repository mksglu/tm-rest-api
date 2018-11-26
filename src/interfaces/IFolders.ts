import { Document } from "mongoose";
export default interface IFolders extends Document {
  _id: string;
  accountId: string;
  parentId: string | null;
  name: string;
  folderType: "template" | "datasheet";
}
