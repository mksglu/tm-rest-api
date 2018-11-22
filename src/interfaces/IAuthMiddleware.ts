import { Request } from "express";
export default interface IAuthMiddleware extends Request {
  token: { id: string; accountId: string; iat: number };
}
