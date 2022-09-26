var sgMail = require("@sendgrid/mail");
const mailAPIKey = process.env.mailAPIKey;

exports.sendEmail = function (req, res) {
  if (!mailAPIKey) {
    const msg = { message: "Cannot send email with no mailAPIKey." };
    if (res) {
      return res.jsonp(msg);
    } else {
      return msg;
    }
  }
  sgMail.setApiKey(mailAPIKey);
  const msg = {
    to: req.body.to,
    from: {
      email: req.body.from,
      name: req.body.fromname,
    },
    cc: req.body.cc,
    bcc: req.body.bcc,
    templateId: req.body.templateId,
    dynamicTemplateData: req.body.dynamicTemplateData,
  };
  sgMail
    .send(msg)
    .then(() => {
      if (res) {
        return res.status(200).send({
          message: "Email sent",
        });
      } else {
        return { message: "Email sent" };
      }
    })
    .catch((error) => {
      if (res) {
        console.log(error);
        return res.status(200).send({
          message: error,
        });
      } else {
        return { message: error };
      }
    });
};
