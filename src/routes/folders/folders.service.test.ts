process.env.NODE_ENV = "test";
import * as crypto from "crypto";
import { IFolders } from "interfaces";
import * as mongoose from "mongoose";
import config from "../../config";
import { decodeToken, mockUser } from "../../utils/test.utils";
import usersService from "../users/users.service";
import foldersService from "./folders.service";

describe("Folders Service", () => {
  beforeAll(done => {
    mongoose.connect(
      config.connectionStr.dev,
      { useNewUrlParser: true },
      done
    );
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });
  let login, token, folderTemplateId, folderDatasheetId;
  it("authentication dependency", async () => {
    await usersService.createUser(mockUser);
    login = await usersService.loginUser(mockUser);
    token = decodeToken(login.data.token);
    folderTemplateId = crypto
      .createHash("md5")
      .update(`template-${token.accountId}-Sample Template Folder`)
      .digest("hex");
    folderDatasheetId = crypto
      .createHash("md5")
      .update(`datasheet-${token.accountId}-Sample Datasheet Folder`)
      .digest("hex");
  });
  describe("/POST folder", () => {
    it("it should a create folder by account id folder type is template", async () => {
      const createFolder = await foldersService.createFolder("template", token.accountId, <IFolders>{
        parentId: null,
        name: "Sample Template Folder"
      });
      expect(createFolder.status).toBe(true);
      expect(createFolder.data._id).toEqual(folderTemplateId);
      expect(createFolder.data.name).toEqual("Sample Template Folder");
      expect(createFolder.data.parentId).toBeNull();
      expect(createFolder.data.folderType).toEqual("template");
      expect(createFolder.data.accountId).toEqual(token.accountId);
    });
    it("it should a create folder by account id folder type is datasheet", async () => {
      const createFolder = await foldersService.createFolder("datasheet", token.accountId, <IFolders>{
        parentId: null,
        name: "Sample Datasheet Folder"
      });
      expect(createFolder.status).toBe(true);
      expect(createFolder.data._id).toEqual(folderDatasheetId);
      expect(createFolder.data.name).toEqual("Sample Datasheet Folder");
      expect(createFolder.data.parentId).toBeNull();
      expect(createFolder.data.folderType).toEqual("datasheet");
      expect(createFolder.data.accountId).toEqual(token.accountId);
    });
  });
  describe("/GET folders", () => {
    it("it should get a folders response get by account id and folder type is template", async () => {
      const getFolder = await foldersService.getFolder("template", token.accountId);
      expect(getFolder.status).toBe(true);
      getFolder.data.forEach(element => {
        expect(getFolder.data).toEqual(expect.arrayContaining([element]));
        expect(element._id).toEqual(folderTemplateId);
        expect(element.name).toEqual("Sample Template Folder");
        expect(element.parentId).toBeNull();
        expect(element.folderType).toEqual("template");
        expect(element.accountId).toEqual(token.accountId);
      });
    });
  });
  describe("/PUT folder", () => {
    it("it should update a folder get by folder id", async () => {
      const updateFolder = await foldersService.updateFolder(folderTemplateId, { name: "Updated Folder Name" } as IFolders);
      expect(updateFolder.status).toBe(true);
      expect(updateFolder.data.name).toEqual("Updated Folder Name");
    });
  });
  describe("/DELETE folder", () => {
    it("it should delete folder get by folder id", async () => {
      const deleteFolder = await foldersService.deleteFolder(folderTemplateId);
      expect(deleteFolder.status).toBe(true);
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
