import axios from "axios";
import * as ejs from "ejs";
import * as fs from "fs";
import config from "../../config";
const email = (email: String, token: String): any => {
  const msg = ejs.render(fs.readFileSync(__dirname + "/templates/mail_confirm.ejs", "utf8"), { token });
  axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${config.email.key}`,
      "Content-Type": "application/json"
    },
    data: {
      personalizations: [{ to: [{ email }] }],
      from: {
        name: config.email.senderName,
        email: config.email.senderAdress
      },
      subject: config.email.subject,
      content: [{ type: "text/html", value: msg }]
    }
  });
};

export default email;
