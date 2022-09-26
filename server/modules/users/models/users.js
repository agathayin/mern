"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require("crypto");

var UserSchema = new Schema({
  email: {
    type: String,
    require: "Email is required",
    lowercase: true,
    unique: true,
    index: {
      unique: true,
    },
  },
  firstName: {
    type: String,
    default: "",
    trim: true,
  },
  lastName: {
    type: String,
    default: "",
    trim: true,
  },
  password: {
    type: String,
    default: "",
  },
  salt: String,
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    this.salt = crypto.randomBytes(16).toString("base64");
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre("validate", function (next) {
  if (this.provider === "local" && this.password && this.isModified("password")) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(" ");
      this.invalidate("password", error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, "base64"), 10000, 64, "SHA1").toString("base64");
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

mongoose.model("User", UserSchema);
