import { Response, Router } from "express";
import { IAuthMiddleware } from "../../interfaces";
import { isUserAuthenticated } from "../../middleware";
import accountsService from "./accounts.service";
const router = Router();
router.get("/accounts/:paramId", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    userId: { id },
    params: { paramId }
  } = req;
  accountsService.getAccount(id, paramId).then(response => {
    return response;
  });
});
export default router;
