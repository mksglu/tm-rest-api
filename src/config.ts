import * as dotenv from "dotenv";
dotenv.config();
export default {
  connectionStr: process.env.MONGODB_STR,
  jwtSecretKey: process.env.JWT_ENCRYPTION,
  jwtExpiration: process.env.JWT_EXPIRATION,
  port: process.env.PORT,
  passwordSecretKey: process.env.SECRET_KEY,
  email: {
    subject: process.env.EMAIL_SUBJECT,
    senderAdress: process.env.EMAIL_SENDER_ADRESS,
    senderName: process.env.EMAIL_SENDER_NAME,
    key: process.env.SENDGRID_API_KEY
  }
};
