import axios from "axios";
import * as ejs from "ejs";
import * as fs from "fs";
import { EMAIL_SENDER_NAME, EMAIL_SENDER_ADRESS, EMAIL_SUBJECT, SENDGRID_API_KEY} from "../../config";
const _email = (email: String, template: String) => {
  return axios({
    method: "post",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    data: {
      personalizations: [{ to: [{ email }] }],
      from: {
        name: EMAIL_SENDER_NAME,
        email: EMAIL_SENDER_ADRESS
      },
      subject: EMAIL_SUBJECT,
      content: [{ type: "text/html", value: template }]
    }
  });
};
export const emailTokenMail = (email: String, token: String) => {
  const mailTemlate = ejs.render(fs.readFileSync(__dirname + "/templates/mail.confirm.ejs", "utf8"), { token });
  _email(email, mailTemlate);
};
export const inviteUserMail = (email: String) => {
  const mailTemlate = ejs.render(fs.readFileSync(__dirname + "/templates/mail.invite.ejs", "utf8"));
  _email(email, mailTemlate);
};
