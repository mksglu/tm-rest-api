import * as crypto from "crypto";
import * as fs from "fs-extra";
import * as path from "path";
import config from "../config";
import { Logs } from "../models";

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
    const rootPath: any = config.NODE_ENV === "dev" || config.NODE_ENV === "prod" ? config.pdf.path : config.pdf.path_test;
    const rootDir = path.resolve("./");
    const fullPath = `${rootDir}/${rootPath}/${accountID}/${datasheetID}/${version}/${language}`;
    await fs.ensureDirSync(fullPath);
    await fs.writeFileSync(`${fullPath}/${productName}.html`, html, "utf-8");
    return fullPath;
  } catch (error) {
    createLogger(error);
  }
};

export default html;
