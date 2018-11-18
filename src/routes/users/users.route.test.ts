process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import * as request from "supertest";
import server from "../../app";
import config from "../../config";
import { INVITE_EMAIL, mockUser } from "../../utils/test.utils";
describe("Users Route", () => {
  beforeAll(done => {
    mongoose.connect(
      config.connectionStr.dev,
      done
    );
  });
  let token, id, mailConfirm: string;
  const user = { ...mockUser, email: "users.route@tdsmaker.com" };
  describe("/POST users", () => {
    it("it should add a new user", done => {
      request(server)
        .post("/sign-up")
        .send(user)
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          id = res.body.data._id;
          mailConfirm = res.body.data.mailConfirm;
          done();
        });
    });
    it("it should login with correct password", done => {
      request(server)
        .post("/sign-in")
        .send({ email: user.email, password: user.password })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          token = res.body.data.token;
          done();
        });
    });
    it("it should return bad request response if wrong password when login user", done => {
      request(server)
        .post("/sign-in")
        .send({ email: user.email, password: "fake-password" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(400);
          done();
        });
    });
    it("it should be invite user", done => {
      request(server)
        .post("/users")
        .set({ Authorization: `Bearer ${token}` })
        .send({ inviteEmail: INVITE_EMAIL })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          done();
        });
    });
    it("it should return unauthorized response if token is null when invite user", done => {
      request(server)
        .post("/users")
        .send({ inviteEmail: INVITE_EMAIL })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should return unauthorized response if token is wrong when invite user", done => {
      request(server)
        .post("/users")
        .set({ Authorization: "Bearer fake-id" })
        .send({ inviteEmail: INVITE_EMAIL })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
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
    it("it should return unauthorized response if token is null when return a user by the given id", done => {
      request(server)
        .get(`/users/${id}`)
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should return unauthorized response if token is wrong when return a user by the given id", done => {
      request(server)
        .get(`/users/${id}`)
        .set({ Authorization: "Bearer fake-token" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
  });
  describe("/PUT users", () => {
    it("it should send email to invite user", done => {
      request(server)
        .put(`/me/mail-confirm/${mailConfirm}`)
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          done();
        });
    });
    it("it should return unauthorized response if token is null when send email to invite user", done => {
      request(server)
        .put(`/users/${id}`)
        .send({ firstName: "Burak" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should return unauthorized response if token is wrong when send email to invite user", done => {
      request(server)
        .put(`/users/${id}`)
        .set({ Authorization: "Bearer fake-token" })
        .send({ firstName: "Burak" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should be update user by the given id", done => {
      request(server)
        .put(`/users/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ firstName: "Burak" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          done();
        });
    });
    it("it should return unauthorized response if token is wrong when update user by the given id", done => {
      request(server)
        .put(`/users/${id}`)
        .set({ Authorization: "Bearer fake-token" })
        .send({ firstName: "Burak" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should return unauthorized response if token is null when update user by the given id", done => {
      request(server)
        .put(`/users/${id}`)
        .send({ firstName: "Burak" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should be update user by the token", done => {
      request(server)
        .put("/me/")
        .set({ Authorization: `Bearer ${token}` })
        .send({ firstName: "Hakan" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(201);
          done();
        });
    });
    it("it should return unauthorized response if token is null when update user by the token", done => {
      request(server)
        .put("/me/")
        .send({ firstName: "Hakan" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("it should return unauthorized response if token is null when update user by the token", done => {
      request(server)
        .put("/me/")
        .set({ Authorization: "Bearer fake-id" })
        .send({ firstName: "Hakan" })
        .end((err: any, res: any) => {
          expect(res.status).toBe(401);
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
