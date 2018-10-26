import * as crypto from "crypto";
import { IUser } from "interfaces";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { Invites, Users } from "../../models";
import mailSenderService from "../mail/mail.service";
const createUser = async (req: IUser): Promise<any> => {
  const User = new Users({
    _id: crypto
      .createHash("md5")
      .update(`${req.firstName}-${req.lastName}-${req.firstName}-${req.email}`)
      .digest("hex"),
    firstName: req.firstName,
    lastName: req.lastName,
    defaultAccount: null,
    email: req.email,
    mailConfirm: crypto.randomBytes(32).toString("hex"),
    state: 0,
    accounts: [],
    password: crypto
      .createHmac("sha256", config.passwordSecretKey)
      .update(req.password)
      .digest("hex")
  });
  try {
    let newUser = await User.save();
    mailSenderService(newUser.email, newUser.mailConfirm);
    return { status: true, data: newUser };
  } catch (error) {
    return { status: false, message: error };
  }
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
const mailConfirm = async (paramKey: string): Promise<any> => {
  try {
    const getUser = await Users.findOne({ mailConfirm: paramKey });
    const updateState = await Users.findByIdAndUpdate(getUser._id, { state: 1 }, { new: true });
    if (!getUser || !updateState) return { status: false, message: "BAD_KEY" };
    const token = jwt.sign({ id: getUser._id }, config.jwtSecretKey);
    return { status: true, data: { token } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const getMe = async (userId: string): Promise<any> => {
  try {
    const u = await Users.findById(userId);
    if (!u) return { status: false, message: "USER_NOT_FOUND" };
    return { status: true, data: u };
  } catch (error) {
    return { status: false, message: error };
  }
};
const inviteUser = async (inviteEmail: string, accountId: string): Promise<any> => {
  try {
    const isMember = await Users.countDocuments({ email: inviteEmail });
    const mainUser = await Users.findById(accountId);
    const inviteUserId = crypto
      .createHash("md5")
      .update(`${inviteEmail}-${accountId}`)
      .digest("hex");
    const isAlreadyInvited = await Invites.countDocuments({ email: inviteEmail, _id: inviteUserId });
    if (isAlreadyInvited) return { status: false, message: "ALREADY_INVITED" };
    if (!isMember) {
      const inviteUser = new Invites({
        _id: inviteUserId,
        accountId: mainUser.defaultAccount,
        inviteHash: crypto.randomBytes(32).toString("hex"),
        email: inviteEmail,
        state: 2
      });
      const newInvites = await inviteUser.save();
      return { status: true, isMember: false, data: { email: newInvites.email } };
    } else {
      const User = await Users.findOne({ email: inviteEmail });
      const inviteUsers = new Invites({
        _id: inviteUserId,
        email: inviteEmail,
        accountId: User.defaultAccount,
        inviteHash: crypto.randomBytes(32).toString("hex"),
        state: 1
      });
      await Users.findOneAndUpdate({ email: inviteEmail }, { $push: { accounts: accountId }, $set: { defaultAccount: accountId } });
      await inviteUsers.save();
      return { status: true, isMember: true };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};
const createInvitedUser = async (inviteHash: string, userId: string, req: IUser): Promise<any> => {
  try {
    const mainUser = await Users.findById(userId);
    if (!mainUser) return { status: false, message: "WRONG_USER_ID" };
    const InvitedUser = await Invites.findOneAndUpdate({ inviteHash }, { $set: { state: 1 } }, { new: true });
    if (!InvitedUser) return { status: false, message: "WRONG_HASH" };
    const User = new Users({
      _id: crypto
        .createHash("md5")
        .update(`${req.firstName}-${req.lastName}-${req.firstName}-${InvitedUser.email}`)
        .digest("hex"),
      firstName: req.firstName,
      lastName: req.lastName,
      defaultAccount: mainUser._id,
      email: InvitedUser.email,
      mailConfirm: crypto.randomBytes(32).toString("hex"),
      state: 1,
      accounts: [mainUser._id],
      password: crypto
        .createHmac("sha256", config.passwordSecretKey)
        .update(req.password)
        .digest("hex")
    });
    const newInvitedUser = await User.save();
    await Invites.findByIdAndUpdate(InvitedUser._id, { accountId: newInvitedUser.defaultAccount });
    const token = jwt.sign({ id: newInvitedUser._id }, config.jwtSecretKey);
    return { status: true, data: { token, user: { ...newInvitedUser["_doc"] } } };
  } catch (error) {
    return { status: false, message: error };
  }
};
export default { createUser, loginUser, getUser, updateMe, updateUser, mailConfirm, getMe, inviteUser, createInvitedUser };
