"use strict";
var userPolicy = require("../policies/users");

module.exports = function (app) {
  // User Routes
  var users = require("../controllers/users");

  // Setting up the users profile api
  app.route("/api/users").all(userPolicy.isAllowed).get(users.list).post(users.create);
  app.route("/api/users/:userId").all(userPolicy.isAllowed).get(users.read).put(users.update).delete(users.delete);

  // Finish by binding the user middleware
  app.param("userId", users.userByID);

  app.route("/api/auth/me").all(userPolicy.isAllowed).get(users.me);
  app.route("/api/auth/signup").all(userPolicy.isAllowed).post(users.create);
  app.route("/api/auth/signin").all(userPolicy.isAllowed).post(users.signIn);
  app.route("/api/auth/logout").all(userPolicy.isAllowed).post(users.logout);
  app.route("/api/auth/forgetPsw").all(userPolicy.isAllowed).post(users.forgetPsw);
  app.route("/api/auth/resetPsw").all(userPolicy.isAllowed).post(users.resetPsw);
};
