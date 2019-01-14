export const INVITE_EMAIL = "inviteduser@tdsmaker.com";
export const ALREADY_MEMBER_EMAIL = "already-member@tdsmaker.com";
export const TEST_USER_ID = "fc8c13c806bc5d2359121547714e438d";
export const TEST_ACCOUNT_ID = "4f78c2feac8068c37bf5c32225fcee78";

import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";

export const mockUser: any = {
  firstName: "Mert",
  lastName: "Koseoglu",
  password: "!2E456",
  email: "mert@tdsmaker.com",
  accountName: "Polisan"
};

export const decodeToken = token => {
  return jwt.verify(token, JWT_SECRET_KEY);
};
