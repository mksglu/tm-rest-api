import * as sgMail from "@sendgrid/mail";
import * as ejs from "ejs";
import * as fs from "fs";
const email = (email: String, token: String): any => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = ejs.render(fs.readFileSync(__dirname + "/templates/mail_confirm.ejs", "utf8"), { token: token });
  const obj = {
    to: email,
    from: {
      name: process.env.EMAIL_SENDER_NAME,
      email: process.env.EMAIL_SENDER_ADRESS
    },
    subject: "Welcome to TDSMaker! Confirm Your Email",
    content: [
      {
        type: "text/html",
        value: msg
      }
    ]
  };
  sgMail.send(obj as any);
};

export default email;
