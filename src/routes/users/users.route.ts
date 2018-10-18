import { Request, Response, Router } from "express";
import mailConfirm from "../mail/mail.service";
import userService from "./users.service";
const router = Router();

router.post("/sign-up", (req: Request, res: Response) => {
  userService.create(req.body).then(
    response => {
      res.send({ status: true, data: response });
      mailConfirm(response.email, response.mailConfirm);
    },
    err => res.send({ status: false, message: err.message })
  );
});
router.post("/sign-in", (req: Request, res: Response) => {
  userService.login(req.body).then(response => res.send({ status: true, data: response }), err => res.send({ status: false, message: err.message }));
});
export default router;
