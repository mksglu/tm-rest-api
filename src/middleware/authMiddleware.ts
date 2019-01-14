import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import { IAuthMiddleware } from "../interfaces";
import rules from "./rules";
const isUserAuthenticated = (req: IAuthMiddleware, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  let bearerToken;
  if (typeof authHeader !== "undefined") {
    const explodeToken = authHeader.split(" ");
    bearerToken = explodeToken[1];
  } else res.status(401).send({ status: false, message: "UNAUTHORIZED" });
  jwt.verify(bearerToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({ status: false, message: err });
    } else {
      req.token = decoded;
      if (!rules.canAccess(req.token.role, req.path, req.method)) return res.status(401).send({ status: false, message: "ROLE_UNAUTHORIZED" });
      next();
    }
  });
};
export default isUserAuthenticated;
