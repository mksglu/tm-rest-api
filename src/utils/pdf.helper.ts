import * as crypto from "crypto";
import * as fs from "fs-extra";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { PDF_BUILDER_PATH, PDF_BUILDER_PATH_TEST} from "../config";
import { Logs } from "../models";

const rootPath: any = process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "prod" ? PDF_BUILDER_PATH : PDF_BUILDER_PATH_TEST;
const rootDir = path.resolve("./");

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
const deletePDF = async (accountID: string, datasheetID: string, productName: string, version: string, language: string): Promise<string> => {
  try {
    if (!accountID || !datasheetID || !productName || !version || !language) {
      throw "some parameters are undefined or null.";
    }
    const fullPath = `${rootDir}/${rootPath}/${accountID}/${datasheetID}/${version}/${language}`;
    if (fs.existsSync(`${fullPath}/${productName}.pdf`)) {
      await fs.removeSync(`${fullPath}/${productName}.pdf`);
    }
    return fullPath;
  } catch (error) {
    createLogger(error);
  }
};
const createPDF = async (accountID: string, datasheetID: string, productName: string, version: string, language: string, html: any): Promise<string> => {
  try {
    if (!accountID || !datasheetID || !productName || !version || !language || !html) {
      throw "some parameters are undefined or null.";
    }
    const fullPath = `${rootDir}/${rootPath}/${accountID}/${datasheetID}/${version}/${language}`;
    if (!fs.existsSync(`${fullPath}/${productName}.pdf`)) {
      await fs.ensureDirSync(fullPath);
      const browser = await puppeteer.launch();
      const tab = await browser.newPage();
      await tab.setContent(html);
      await tab.pdf({ path: `${fullPath}/${productName}.pdf`, format: "A4" });
      await browser.close();
    }
    return fullPath;
  } catch (error) {
    createLogger(error);
  }
};

export { createPDF, deletePDF };
