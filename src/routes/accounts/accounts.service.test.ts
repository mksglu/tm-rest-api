process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import config from "../../config";
import { decodeToken, mockUser } from "../../utils/test.utils";
import usersService from "../users/users.service";
import accountsService from "./accounts.service";

describe("Accounts Service", () => {
  beforeAll(done => {
    mongoose.connect(
      config.connectionStr.dev,
      { useNewUrlParser: true },
      done
    );
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });
  let u, token, login: any;
  it("authentication dependency", async () => {
    u = await usersService.createUser(mockUser);
    login = await usersService.loginUser(mockUser);
    token = decodeToken(login.data.token);
  });
  describe("/GET accounts", () => {
    it("it should get a account response get by account id", async () => {
      const account = await accountsService.getAccount(token.accountId);
      expect(account.status).toBe(true);
      expect(account.data.name).toEqual("Polisan");
      expect(account.data._id).toEqual(u.data.defaultAccount);
      expect(account.data.users).toEqual(expect.arrayContaining([token.id]));
    });
  });
  describe("/PUT accounts", () => {
    it("it should update a account get by account id", async () => {
      const account = await accountsService.updateAccount(token.accountId, <any>{ name: "updatedName" });
      expect(account.status).toBe(true);
      expect(account.data.name).toEqual("updatedName");
      expect(account.data._id).toEqual(u.data.defaultAccount);
      expect(account.data.users).toEqual(expect.arrayContaining([token.id]));
    });
  });
  afterAll(done => {
    mongoose.connection.dropDatabase(() => {
      mongoose.connection.close(() => {
        done();
      });
    });
  });
});
