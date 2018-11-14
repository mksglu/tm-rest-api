process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import config from "../../config";
import { ALREADY_MEMBER_EMAIL, INVITE_EMAIL, userServiceMockUser } from "../../utils/test.utils";
import userService from "./users.service";
describe("Users Service", () => {
  let _mailConfirm: string;
  let userToken: any = {};
  beforeAll(done => {
    mongoose.connect(
      config.connectionStr.dev,
      done
    );
  });
  describe("/POST users", () => {
    it("it should add a new user", done => {
      userService.createUser(userServiceMockUser).then(res => {
        const { _id, accounts, firstName, lastName, defaultAccount, email, mailConfirm, state, password } = res.data;
        userToken.id = res.data._id;
        _mailConfirm = res.data.mailConfirm;
        expect(res.status).toBe(true);
        expect(_id).toEqual("fc8c13c806bc5d2359121547714e438d");
        expect(firstName).toEqual("Duygu");
        expect(lastName).toEqual("Aksoy");
        expect(defaultAccount).toEqual(null);
        expect(email).toEqual("duygu@tdsmaker.com");
        expect(mailConfirm).toBeDefined();
        expect(state).toEqual(0);
        expect(password).toEqual("44e650a9fe927d8a144060031e239cbb6334b93a6771579d95e58659a8dcf54e");
        expect(accounts).toEqual(expect.arrayContaining([]));
        done();
      });
    });
    it("it should be login", done => {
      const login: any = { email: userServiceMockUser.email, password: userServiceMockUser.password };
      userService.loginUser(login).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.token).toBeDefined();
        done();
      });
    });
    it("it should return is member false when non-member user invitation", done => {
      userService.inviteUser(INVITE_EMAIL, userToken.id).then(res => {
        expect(res.status).toBe(true);
        expect(res.isMember).toBe(false);
        done();
      });
    });
    it("it should return is member true when already member user invitation", done => {
      userService.createUser({ ...userServiceMockUser, email: ALREADY_MEMBER_EMAIL }).then(res => {
        userService.inviteUser(res.data.email, userToken.id).then(res => {
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
        expect(_id).toEqual("fc8c13c806bc5d2359121547714e438d");
        expect(email).toEqual("duygu@tdsmaker.com");
        expect(password).toBeUndefined();
        done();
      });
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
      const updatedName: any = { firstName: "Mert" };
      userService.updateUser(userToken.id, userToken.id, updatedName).then(res => {
        expect(res.status).toBe(true);
        expect(res.data.firstName).toEqual("Mert");
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
    setTimeout(() => {
      mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => {
          done();
        });
      });
    }, 2000);
  });
});
