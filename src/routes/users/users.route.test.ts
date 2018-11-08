process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import * as request from "supertest";
import server from "../../app";
import { INVITE_EMAIL, mockUser } from "../../utils/test.utils";
describe("Users Route", () => {
  let token, id: string;
  describe("/POST users", () => {
    it("it should add a new user", done => {
      request(server)
        .post("/sign-up")
        .send(mockUser)
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          id = res.body.data._id;
          done();
        });
    });
    it("it should login with correct password ", done => {
      request(server)
        .post("/sign-in")
        .send({ email: mockUser.email, password: mockUser.password })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          token = res.body.data.token;
          done();
        });
    });
    it("should be invite user", done => {
      request(server)
        .post("/users")
        .set({ Authorization: `Bearer ${token}` })
        .send({ inviteEmail: INVITE_EMAIL })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          done();
        });
    });
  });
  describe("/GET users", () => {
    it("it should be return a user by the given id", done => {
      request(server)
        .get(`/users/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err: any, res: any) => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });
  afterAll(done => {
    mongoose.connection.dropDatabase();
    done();
  });
});
