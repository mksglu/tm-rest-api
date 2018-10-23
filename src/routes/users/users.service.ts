import * as crypto from "crypto";
import { IUser } from "interfaces";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { Users } from "../../models";
import mailConfirm from "../mail/mail.service";
const createUser = (req: IUser, model: IUser | any = {}): any => {
  const newUser = new Users(model);
  newUser._id = crypto
    .createHash("md5")
    .update(`${req.firstName}-${req.lastName}-${req.firstName}-${req.email}`)
    .digest("hex");
  newUser.firstName = req.firstName;
  newUser.lastName = req.lastName;
  newUser.defaultAccount = null;
  newUser.email = req.email;
  newUser.mailConfirm = crypto.randomBytes(32).toString("hex");
  newUser.state = 0;
  newUser.password = crypto
    .createHmac("sha256", config.passwordSecretKey)
    .update(req.password)
    .digest("hex");
  return newUser
    .save()
    .then(response => {
      mailConfirm(response.email, response.mailConfirm);
      return { status: true, data: response };
    })
    .catch(error => {
      return { status: false, message: error };
    });
};
const loginUser = async (req: IUser): Promise<any> => {
  const { email, password } = req;
  if (!req.email || !req.password) return { status: false, message: "REQUIRE_EMAIL_OR_PASSWORD" };
  try {
    const u = await Users.findOne({ email }).select("+password");
    if (!u) return { status: false, message: "USER_NOT_FOUND" };
    const isPasswordValid =
      crypto
        .createHmac("sha256", config.passwordSecretKey)
        .update(password)
        .digest("hex") === u.password;
    if (!isPasswordValid) return { status: false, message: "INVALID_PASSWORD" };
    const token = jwt.sign({ id: u._id }, config.jwtSecretKey);
    return { status: true, data: { token } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const getUser = async (userId: string, paramId: string): Promise<any> => {
  try {
    let u = await Users.findOne({ _id: userId });
    if (!u || u._id !== paramId || userId !== paramId) return { status: false, message: "USER_NOT_FOUND" };
    return { status: true, data: { ...u["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const updateMe = async (userId: string, req: IUser): Promise<any> => {
  try {
    if (req.password)
      req.password = crypto
        .createHmac("sha256", config.passwordSecretKey)
        .update(req.password)
        .digest("hex");
    const u = await Users.findByIdAndUpdate(userId, req, { new: true });
    if (!u) return { status: false, message: "USER_NOT_UPDATED" };
    return { status: true, data: u };
  } catch (error) {
    return { status: false, message: error };
  }
};
const updateUser = async (userId: string, paramId: string, req: IUser): Promise<any> => {
  try {
    if (req.password)
      req.password = crypto
        .createHmac("sha256", config.passwordSecretKey)
        .update(req.password)
        .digest("hex");
    if (userId !== paramId) return { status: false, message: "USER_NOT_FOUND" };
    const u = await Users.findByIdAndUpdate(paramId, req, { new: true });
    if (!u || u._id !== paramId) return { status: false, message: "USER_NOT_UPDATED" };
    return { status: true, data: u };
  } catch (error) {
    return { status: false, message: error };
  }
};

export default { create: createUser, login: loginUser, getUser, updateMe, updateUser };
