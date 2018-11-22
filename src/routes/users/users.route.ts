import { Request, Response, Router } from "express";
import { IAuthMiddleware } from "../../interfaces";
import { isUserAuthenticated } from "../../middleware";
import userService from "./users.service";
const router = Router();
router.post("/sign-up", (req: Request, res: Response) => {
  if (req.query.invite && req.query.userId) {
    const {
      query: { invite },
      query: { userId }
    } = req;
    userService.createInvitedUser(invite, userId, req.body).then(response => {
      if (!response.status) return res.status(400).send(response);
      return res.status(201).send(response);
    });
  } else {
    userService.createUser(req.body).then(response => {
      if (!response.status) return res.status(400).send(response);
      return res.status(201).send(response);
    });
  }
});
router.post("/sign-in", (req: Request, res: Response) => {
  userService.loginUser(req.body).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.get("/users/:paramId", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    token: { id },
    params: { paramId }
  } = req;
  userService.getUser(id, paramId).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(200).send(response);
  });
});
router.put("/me", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    token: { id }
  } = req;
  userService.updateMe(id, req.body).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.put("/users/:paramId", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    token: { id },
    params: { paramId }
  } = req;
  userService.updateUser(id, paramId, req.body).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.put("/me/mail-confirm/:paramKey", (req: Request, res: Response) => {
  const {
    params: { paramKey }
  } = req;
  userService.mailConfirm(paramKey).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});
router.get("/me", (req: Request, res: Response) => {
  const fakeId = "9cc3b8330347db0eca3556dafc47b8c5";
  userService.getMe(fakeId).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(200).send(response);
  });
});
router.post("/users", isUserAuthenticated, (req: IAuthMiddleware, res: Response) => {
  const {
    body: { inviteEmail },
    token: { id }
  } = req;
  userService.inviteUser(inviteEmail, id).then(response => {
    if (!response.status) return res.status(400).send(response);
    return res.status(201).send(response);
  });
});

export default router;
