import * as crypto from "crypto";
import { IFolders } from "interfaces";
import { Folders } from "../../models";

const createFolder = async (folderType: string, accountId: string, req: IFolders): Promise<any> => {
  const Folder = new Folders({
    _id: crypto
      .createHash("md5")
      .update(`${folderType}-${accountId}-${req.name}`)
      .digest("hex"),
    accountId,
    parentId: req.parentId,
    name: req.name,
    folderType
  });
  try {
    const newFolder = await Folder.save();
    return { status: true, data: { ...newFolder["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const getFolder = async (folderType: string, accountId: string): Promise<any> => {
  try {
    const getFolder = await Folders.find({ folderType, accountId });
    return { status: true, data: getFolder };
  } catch (error) {
    return { status: false, message: error };
  }
};
const deleteFolder = async (folderId: string): Promise<any> => {
  try {
    const deleteFolder = await Folders.findByIdAndDelete(folderId);
    return { status: true, data: { ...deleteFolder["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const updateFolder = async (folderId: string, req: IFolders): Promise<any> => {
  try {
    const updateFolder = await Folders.findByIdAndUpdate(folderId, { $set: { name: req.name, parentId: req.parentId } }, { new: true });
    return { status: true, data: { ...updateFolder["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};
export default { updateFolder, deleteFolder, createFolder, getFolder };
