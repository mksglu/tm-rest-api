process.env.NODE_ENV = "test";
import * as fs from "fs-extra";
import html_helper from "./html.helper";

describe("HTML Helper", () => {
  it("it should be create a new directory and inside directory create a new html file", async () => {
    await html_helper("account_id", "datasheet_id", "productName", "version", "language", "<h1>TDSMaker</h1>");
    const _path = `./test_uploads/account_id/datasheet_id/version/language/productName.html`;
    const isExist = await fs.pathExistsSync(_path);
    expect(isExist).toBe(true);
    if (isExist) await fs.removeSync("./test_uploads");
  });
});
