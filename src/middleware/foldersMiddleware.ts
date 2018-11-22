import { NextFunction, Response } from "express";
import { IAuthMiddleware } from "interfaces";

const isValidFolderType = (req: IAuthMiddleware, res: Response, next: NextFunction) => {
  if (req.params.folderType === "template" || req.params.folderType === "datasheet") {
    next();
  } else {
    return res.status(400).send({ status: false, message: "INVALID_TYPE" });
  }
};

export default isValidFolderType;
