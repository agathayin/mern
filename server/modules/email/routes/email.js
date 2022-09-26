"use strict";

module.exports = function (app) {
  var emails = require("../controllers/email");
  app.route("/api/sendEmail").post(emails.sendEmail);
};
