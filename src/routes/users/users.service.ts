import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { IUser } from "interfaces";
import { Users } from "../../models";
import { randomString } from "../../utils";
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
  newUser.mailConfirm = randomString;
  newUser.state = 0;
  newUser.password = bcrypt.hashSync(Req.password, 12);

  return newUser.save();
};

export default { create: createUser };
