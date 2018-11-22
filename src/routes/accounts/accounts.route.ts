import { Response, Router } from "express";
import { IAuthMiddleware } from "../../interfaces";
import { isUserAuthenticated } from "../../middleware";
import accountsService from "./accounts.service";
const router = Router();
router.get("/accounts", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    token: { accountId }
  } = req;
  accountsService.getAccount(accountId).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.put("/accounts", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    token: { accountId }
  } = req;
  accountsService.updateAccount(accountId, req.body).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
export default router;
