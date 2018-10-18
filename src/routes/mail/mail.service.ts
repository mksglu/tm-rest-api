import axios from "axios";
import * as ejs from "ejs";
import * as fs from "fs";
const email = (email: String, token: String): any => {
  const msg = ejs.render(fs.readFileSync(__dirname + "/templates/mail_confirm.ejs", "utf8"), { token });
  axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    data: {
      personalizations: [{ to: [{ email: email }] }],
      from: { email: process.env.EMAIL_SENDER_ADRESS },
      subject: "Welcome to TDSMaker! Confirm Your Email",
      content: [{ type: "text/html", value: msg }]
    }
  });
};

export default email;
