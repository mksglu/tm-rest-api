import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { IAuthMiddleware } from "../interfaces";
const isUserAuthenticated = (req: IAuthMiddleware, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  let bearerToken;
  if (typeof authHeader !== "undefined") {
    const explodeToken = authHeader.split(" ");
    bearerToken = explodeToken[1];
  } else res.status(401).send({ status: false, message: "UNAUTHORIZED" });
  jwt.verify(bearerToken, config.jwtSecretKey, (err, decoded) => {
    if (err) {
      res.status(401).send({ status: false, message: err });
    } else {
      req.token = decoded;
      next();
    }
  });
};
export default isUserAuthenticated;
