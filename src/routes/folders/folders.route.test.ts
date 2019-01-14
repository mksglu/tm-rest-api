process.env.NODE_ENV = "test";
import * as mongoose from "mongoose";
import * as request from "supertest";
import server from "../../app";
import { DB_CONNECTION } from "../../config";
import { mockUser } from "../../utils/test.utils";
import usersService from "../users/users.service";
describe("Folders Route", () => {
  beforeAll(done => {
    mongoose.connect(
      DB_CONNECTION,
      { useNewUrlParser: true },
      done
    );
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });
  let folderId, login;
  it("authentication dependency", async () => {
    await usersService.createUser(mockUser);
    login = await usersService.loginUser(mockUser);
  });
  describe("/POST folder", () => {
    it("it should a create folder by account id folder type", async () => {
      const res = await request(server)
        .post("/folder/template")
        .set({ Authorization: `Bearer ${login.data.token}` })
        .send({ name: "Sample Folder Name" });
      expect(res.status).toBe(201);
      folderId = res.body.data._id;
    });
  });
  describe("/GET folders", () => {
    it("it should get a folders response get by account id and folder type is template", async () => {
      const res = await request(server)
        .get(`/folders/template`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(200);
    });
    it("it should get a folders response get by account id and folder type is datasheet", async () => {
      const res = await request(server)
        .get(`/folders/datasheet`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(200);
    });
    it("it should return invalid type response if wrong folder type when get a folders", async () => {
      const res = await request(server)
        .get(`/folders/fake-param`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(400);
    });
    it("it should return unauthorized response if token is wrong when get a folders", async () => {
      const res = await request(server)
        .get(`/folders/template`)
        .set({ Authorization: `Bearer fake-token` });
      expect(res.status).toBe(401);
    });
  });
  describe("/PUT folder", () => {
    it("it should update a folder get by folder id", async () => {
      const res = await request(server)
        .put(`/folder/${folderId}`)
        .set({ Authorization: `Bearer ${login.data.token}` })
        .send({ name: "The Updated Samle Folder" });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toEqual("The Updated Samle Folder");
    });
  });
  describe("/DELETE folder", () => {
    it("it should delete folder get by folder id", async () => {
      const res = await request(server)
        .put(`/folder/${folderId}`)
        .set({ Authorization: `Bearer ${login.data.token}` });
      expect(res.status).toBe(200);
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
