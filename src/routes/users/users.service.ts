import * as crypto from "crypto";
import { IUser } from "interfaces";
import { Users } from "../../models";
const createUser = (Req: IUser, model: IUser | any = {}): Promise<any> => {
  const newUser = new Users(model);
  newUser._id = crypto
    .createHash("md5")
    .update(`${Req.firstName}-${Req.lastName}-${Req.firstName}-${Req.email}`)
    .digest("hex");
  newUser.firstName = Req.firstName;
  newUser.lastName = Req.lastName;
  newUser.defaultAccount = null;
  newUser.email = Req.email;
  newUser.mailConfirm = crypto.randomBytes(32).toString("hex");
  newUser.state = 0;
  newUser.password = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(Req.password)
    .digest("hex");
  return newUser.save();
};

export default { create: createUser };
