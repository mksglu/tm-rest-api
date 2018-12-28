process.env.NODE_ENV = "test";
import * as fs from "fs-extra";
import { createPDF } from "./pdf.helper";

describe("PDF Helper", () => {
  it("it should be create a new directory and inside directory create a new pdf file", async () => {
    await createPDF("account_id", "datasheet_id", "productName", "version", "language", "<h1>TDSMaker</h1>");
    const _path = `./test_uploads/account_id/datasheet_id/version/language/productName.pdf`;
    const isExist = await fs.pathExistsSync(_path);
    expect(isExist).toBe(true);
    if (isExist) await fs.removeSync("./test_uploads");
  });
});
