import { Application } from "express";
import accountsRoute from "./accounts/accounts.route";
import userRoute from "./users/users.route";
export class Routes {
  public routes(app: Application): void {
    app.use("/", userRoute, accountsRoute);
  }
}
