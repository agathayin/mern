"use strict";

/**
 * Module dependencies
 */
var path = require("path");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var passport = require("passport");

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = async function (req, res) {
  var user = req.model;
  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  // user.displayName = user.firstName + " " + user.lastName;
  user.roles = req.body.roles;
  try {
    const resp = await user.save();
    return res.jsonp(resp);
  } catch (err) {
    return res.status(422).send({ message: err.message });
  }
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = async function (req, res) {
  const users = await User.find({});
  return res.jsonp(users);
};
exports.create = async function (req, res) {
  const user = new User(req.body);
  try {
    let count = await User.count({ email: req.body.email });
    if (count) {
      return res.status(400).send({ message: "Cannot sign up with this email" });
    }
    let resp = await user.save();
    return res.jsonp(resp);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};

exports.signIn = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};
exports.logout = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
};
exports.me = function (req, res) {
  if (req.user) {
    return res.jsonp(req.user);
  } else {
    return res.jsonp({});
  }
};
exports.forgetPsw = async function (req, res) {
  if (!req.body.email) {
    return res.status(400).send({ message: "Email is required" });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // user does not exist, send fake success response
    return res.status(204).send();
  } else {
    user.resetPasswordToken = Math.floor(1000 + Math.random() * 9000);
    user.resetPasswordExpires = new Date(new Date().getTime() + 1000 * 60 * 60);
    console.log(`forgetPsw:  ${user.email} (${user.resetPasswordToken})`);
    console.log("forgetPsw link: " + encodeURIComponent(user.email));
    await user.save();
    return res.status(204).send();
  }
};
exports.resetPsw = async function (req, res) {
  if (!req.body.email) {
    return res.status(400).send({ message: "Email is required" });
  }
  if (!req.body.resetPasswordToken && !req.body.password) {
    return res.status(400).send({ message: "Please fill in code or old password" });
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // user does not exist
    return res.status(400).send({ message: "Password or code does not match. Please check." });
  }
  if (req.body.resetPasswordToken) {
    if (req.body.resetPasswordToken != user.resetPasswordToken) {
      return res.status(400).send({ message: "Password or code does not match. Please check." });
    } else if (new Date() > user.resetPasswordExpires) {
      return res
        .status(400)
        .send({ message: "The code is invalid or expired. Please request a new forget password email." });
    } else {
      user.password = req.body.newPassword;
      await user.save();
      return res.status(200).send({ success: true });
    }
  } else if (req.body.password) {
    if (user.authenticate(req.body.password)) {
      user.password = req.body.newPassword;
      await user.save();
      return res.status(200).send({ success: true });
    }
  }
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "User is invalid",
    });
  }

  User.findById(id, "-salt -password -providerData").exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error("Failed to load user " + id));
    }

    req.model = user;
    next();
  });
};
