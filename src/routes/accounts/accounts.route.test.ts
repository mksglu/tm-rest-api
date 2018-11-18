process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import * as request from "supertest";
import server from "../../app";
import config from "../../config";
import { mockUser } from "../../utils/test.utils";
import usersService from "../users/users.service";

describe("Accounts Route", () => {
  beforeAll(done => {
    mongoose.connect(
      config.connectionStr.dev,
      done
    );
  });
  const user = { ...mockUser, email: "accounts.route@tdsmaker.com" };
  let u, login: any;
  it("authentication dependency", async () => {
    u = await usersService.createUser(user);
    login = await usersService.loginUser(user);
  });
  describe("/GET accounts", () => {
    it("it should get a account response get by account id", async () => {
      const res = await request(server)
        .get(`/accounts/${u.data.defaultAccount}`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(201);
    });
    it("it should return unauthorized response if token is wrong when account details get by account id", async done => {
      const res = await request(server)
        .get(`/accounts/${u.data.defaultAccount}`)
        .set({ Authorization: `Bearer fake-token` });
      expect(res.status).toBe(401);
      done();
    });
  });
  describe("/PUT accounts", () => {
    it("it should update a account get by account id", async () => {
      const res = await request(server)
        .put(`/accounts/${u.data.defaultAccount}`)
        .set({ Authorization: `Bearer ${login.data.token}` })
        .send({ name: "Dintek" });
      expect(res.status).toBe(201);
      expect(res.body.data.name).toEqual("Dintek");
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
