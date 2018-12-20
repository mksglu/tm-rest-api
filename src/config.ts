import * as dotenv from "dotenv";
dotenv.config();
export default {
  connectionStr: {
    dev: process.env.MONGODB_STR_DEV,
    prod: process.env.MONGODB_STR_PROD
  },
  jwtSecretKey: process.env.JWT_ENCRYPTION,
  jwtExpiration: process.env.JWT_EXPIRATION,
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  passwordSecretKey: process.env.SECRET_KEY,
  email: {
    subject: process.env.EMAIL_SUBJECT,
    senderAdress: process.env.EMAIL_SENDER_ADRESS,
    senderName: process.env.EMAIL_SENDER_NAME,
    key: process.env.SENDGRID_API_KEY
  },
  pdf: {
    path: process.env.PDF_BUILDER_PATH,
    path_test: process.env.PDF_BUILDER_PATH_TEST
  }
};
