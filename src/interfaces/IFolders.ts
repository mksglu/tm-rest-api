import { Document } from "mongoose";

export default interface IFolders extends Document {
  _id: string;
  accountId: string;
  parentId: string;
  name: string;
  folderType: string;
}
