import { Request } from "express";
export default interface IAuthMiddleware extends Request {
  userId: { id: string; iat: number };
}
