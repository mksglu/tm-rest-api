import { Request, Response, Router } from "express";
import { IAuthMiddleware } from "../../interfaces";
import { isUserAuthenticated } from "../../middleware";
import userService from "./users.service";
const router = Router();

router.post("/sign-up", (req: Request, res: Response) => {
  userService.create(req.body).then(response => {
    if (!response.status) res.status(400).send(response);
    res.status(201).send(response);
  });
});

router.post("/sign-in", (req: Request, res: Response) => {
  userService.login(req.body).then(response => {
    if (!response.status) res.status(400).send(response);
    res.status(201).send(response);
  });
});

router.get("/users/:paramId", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    userId: { id },
    params: { paramId }
  } = req;
  userService.getUser(id, paramId).then(response => {
    if (!response.status) res.status(400).send(response);
    res.status(200).send(response);
  });
});

export default router;
