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
  let login: any;
  it("authentication dependency", async () => {
    await usersService.createUser(user);
    login = await usersService.loginUser(user);
  });
  describe("/GET accounts", () => {
    it("it should get a account response get by account id", async () => {
      const res = await request(server)
        .get(`/accounts`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(200);
    });
    it("it should return unauthorized response if token is wrong when account details get by account id", async () => {
      const res = await request(server)
        .get(`/accounts`)
        .set({ Authorization: `Bearer fake-token` });
      expect(res.status).toBe(401);
    });
  });
  describe("/PUT accounts", () => {
    it("it should update a account get by account id", async () => {
      const res = await request(server)
        .put(`/accounts`)
        .set({ Authorization: `Bearer ${login.data.token}` })
        .send({ name: "Dintek" });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toEqual("Dintek");
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
