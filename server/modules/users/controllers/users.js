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
exports.update = function (req, res) {
  var user = req.model;
  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + " " + user.lastName;
  user.roles = req.body.roles;
  user.barcodePrinterID = req.body.barcodePrinterID;
  user.barcodePrinterID2 = req.body.barcodePrinterID2;
  user.shipmentPrinterID = req.body.shipmentPrinterID;
  user.shipmentPrinterID2 = req.body.shipmentPrinterID2;

  user.printerComm = req.body.printerComm;
  user.printerType = req.body.printerType;
  user.gServiceAccount = req.body.gServiceAccount;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err),
      });
    }

    res.json(user);
  });
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
  let resp = await user.save();
  return res.jsonp(resp);
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
