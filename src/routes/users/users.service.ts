import * as crypto from "crypto";
import { IUser } from "interfaces";
import * as jwt from "jsonwebtoken";
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
const loginUser = async (req: IUser): Promise<any> => {
  const { email, password } = req;
  if (!req.email || !req.password) {
    return "Require Email / Require Password";
  }

  try {
    const u = await Users.findOne({ email });
    if (!u) {
      return { status: false, message: "user not found" };
    }
    const isPasswordValid =
      crypto
        .createHmac("sha256", process.env.SECRET_KEY)
        .update(password)
        .digest("hex") === u.password;
    if (!isPasswordValid) {
      return { status: false, message: "invalid password" };
    }
    const token = jwt.sign({ id: u._id }, process.env.JWT_ENCRYPTION, {
      expiresIn: process.env.JWT_EXPIRATION
    });
    return { status: true, token };
  } catch (error) {
    return { status: false, message: error };
  }
};
export default { create: createUser, login: loginUser };
