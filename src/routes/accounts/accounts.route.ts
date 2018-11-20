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
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.put("/accounts/:paramId", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    userId: { id },
    params: { paramId }
  } = req;
  accountsService.updateAccount(id, paramId, req.body).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
export default router;
