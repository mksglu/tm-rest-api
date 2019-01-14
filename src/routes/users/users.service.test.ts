process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import { DB_CONNECTION } from "../../config";
import { ALREADY_MEMBER_EMAIL, INVITE_EMAIL, mockUser } from "../../utils/test.utils";
import userService from "./users.service";

describe("Users Service", () => {
  let _mailConfirm: string;
  let userToken: any = {};
  beforeAll(done => {
    mongoose.connect(
      DB_CONNECTION,
      { useNewUrlParser: true },
      done
    );
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });
  describe("/POST users", () => {
    it("it should add a new user", done => {
      userService.createUser(mockUser).then(res => {
        const { _id, accounts, firstName, lastName, defaultAccount, email, mailConfirm, state, password } = res.data;
        userToken.id = res.data._id;
        _mailConfirm = res.data.mailConfirm;
        expect(res.status).toBe(true);
        expect(_id).toEqual("d8d88325ed9be82420914811a2c790ee");
        expect(firstName).toEqual("Mert");
        expect(lastName).toEqual("Koseoglu");
        expect(defaultAccount).toEqual("4f78c2feac8068c37bf5c32225fcee78");
        expect(email).toEqual("mert@tdsmaker.com");
        expect(mailConfirm).toBeDefined();
        expect(state).toEqual(0);
        expect(password).toBeUndefined();
        expect(accounts).toEqual(expect.arrayContaining([]));
        done();
      });
    });
    it("it should be login", done => {
      userService.loginUser(mockUser).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.token).toBeDefined();
        done();
      });
    });
    it("it should return is member false when non-member user invitation", done => {
      userService.inviteUser(INVITE_EMAIL, "admin", userToken.id).then(res => {
        expect(res.status).toBe(true);
        expect(res.isMember).toBe(false);
        done();
      });
    });
    it("it should return is member true when already member user invitation", done => {
      userService.createUser({ ...mockUser, email: ALREADY_MEMBER_EMAIL }).then(res => {
        userService.inviteUser(res.data.email, "admin", userToken.id).then(res => {
          expect(res.status).toBe(true);
          expect(res.isMember).toBe(true);
          done();
        });
      });
    });
  });
  describe("/GET users", () => {
    it("it should be return a user by the given id", done => {
      userService.getUser(userToken.id, userToken.id).then(res => {
        const { _id, email, password } = res.data;
        expect(res.status).toBe(true);
        expect(_id).toEqual("d8d88325ed9be82420914811a2c790ee");
        expect(email).toEqual(mockUser.email);
        expect(password).toBeUndefined();
        done();
      });
    });
    it("it should be return true when user is exist and email is valid", async () => {
      const u = await userService.signUpCheckEmail(mockUser.email);
      expect(u.isExist).toBe(true);
    });
    it("it should be return false when user is un exist and email is valid", async () => {
      const u = await userService.signUpCheckEmail("unexist@email.com");
      expect(u.isExist).toBe(false);
    });
    it("it should be return invalid email when email is invalid", async () => {
      const u = await userService.signUpCheckEmail("invalidemail");
      expect(u.message).toEqual("INVALID_EMAIL");
    });
  });
  describe("/PUT users", () => {
    it("it should send email to invite user", done => {
      userService.mailConfirm(_mailConfirm).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.token).toBeDefined();
        userService.getUser(userToken.id, userToken.id).then(res => {
          expect(res.data.state).toEqual(1);
        });
        done();
      });
    });
    it("it should be update user by the given id", done => {
      const updatedName: any = { firstName: "Duygu" };
      userService.updateUser(userToken.id, userToken.id, updatedName).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.firstName).toEqual("Duygu");
        done();
      });
    });
    it("it should be update user by the token", done => {
      const updatedName: any = { firstName: "Ayca" };
      userService.updateMe(userToken.id, updatedName).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.firstName).toEqual("Ayca");
        done();
      });
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
