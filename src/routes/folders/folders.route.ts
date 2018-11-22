import { Response, Router } from "express";
import { IAuthMiddleware } from "../../interfaces";
import { isUserAuthenticated, isValidFolderType } from "../../middleware";
import foldersService from "./folders.service";

const router = Router();
router.post("/folder/:folderType", isUserAuthenticated, isValidFolderType, async (req: IAuthMiddleware, res: Response) => {
  const createFolder = await foldersService.createFolder(req.params.folderType, req.token.accountId, req.body);
  if (!createFolder.status) return res.status(400).send(createFolder);
  return res.status(201).send(createFolder);
});
router.get("/folders/:folderType", isUserAuthenticated, isValidFolderType, async (req: IAuthMiddleware, res: Response) => {
  const getFolder = await foldersService.getFolder(req.params.folderType, req.token.accountId);
  if (!getFolder.status) return res.status(400).send(getFolder);
  return res.status(200).send(getFolder);
});
router.delete("/folder/:folderId", isUserAuthenticated, async (req: IAuthMiddleware, res: Response) => {
  const deleteFolder = await foldersService.deleteFolder(req.params.folderId);
  if (!deleteFolder.status) return res.status(400).send(deleteFolder);
  return res.status(200).send(deleteFolder);
});
router.put("/folder/:folderId", isUserAuthenticated, async (req: IAuthMiddleware, res: Response) => {
  const updateFolder = await foldersService.updateFolder(req.params.folderId, req.body);
  if (!updateFolder.status) return res.status(400).send(updateFolder);
  return res.status(200).send(updateFolder);
});

export default router;
