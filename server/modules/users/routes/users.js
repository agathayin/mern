"use strict";

module.exports = function (app) {
  // User Routes
  var users = require("../controllers/users");

  // Setting up the users profile api
  app.route("/api/users").get(users.list).post(users.create);
  app.route("/api/users/:userId").get(users.read).put(users.update).delete(users.delete);

  app.route("/api/record").get(users.list);

  // Finish by binding the user middleware
  app.param("userId", users.userByID);

  app.route("/api/auth/me").get(users.me);
  app.route("/api/auth/signup").post(users.create);
  app.route("/api/auth/signin").post(users.signIn);
  app.route("/api/auth/logout").post(users.logout);
};
