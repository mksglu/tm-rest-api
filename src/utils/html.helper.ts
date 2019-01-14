import * as crypto from "crypto";
import * as fs from "fs-extra";
import * as path from "path";
import { PDF_BUILDER_PATH, PDF_BUILDER_PATH_TEST } from "../config";
import { Logs } from "../models";
import { deletePDF } from "./pdf.helper";

const createLogger = async error => {
  try {
    const Log = new Logs({
      _id: crypto
        .createHash("md5")
        .update(`${new Date().getUTCMilliseconds()}`)
        .digest("hex"),
      logMessage: error
    });
    await Log.save();
  } catch (error) {
    throw Error(error);
  }
};
const html = async (accountID: string, datasheetID: string, productName: string, version: string, language: string, html: any): Promise<string> => {
  try {
    if (!accountID || !datasheetID || !productName || !version || !language || !html) {
      throw "some parameters are undefined or null.";
    }
    const rootPath: any = process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "prod" ? PDF_BUILDER_PATH : PDF_BUILDER_PATH_TEST;
    const rootDir = path.resolve("./");
    const fullPath = `${rootDir}/${rootPath}/${accountID}/${datasheetID}/${version}/${language}`;
    await fs.ensureDirSync(fullPath);
    await fs.writeFileSync(`${fullPath}/${productName}.html`, html, "utf-8");
    await deletePDF(accountID, datasheetID, productName, version, language);
    return fullPath;
  } catch (error) {
    createLogger(error);
  }
};

export default html;
