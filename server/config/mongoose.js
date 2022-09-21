"use strict";

/**
 * Module dependencies.
 */
const _ = require("lodash");
const config = require("./config.js");
const path = require("path");
const mongoose = require("mongoose");

// Load the mongoose models
module.exports.loadModels = function () {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
};

// Initialize Mongoose
module.exports.connect = async function (callback) {
  var options = _.merge(config.db.options || {});
  try {
    const connection = await mongoose.connect(config.db.uri, options);
    mongoose.set("debug", config.db.debug);
    if (callback) callback(connection);
    return connection;
  } catch (err) {
    console.error("Could not connect to MongoDB!");
    console.log(err);
  }
};

module.exports.disconnect = function (cb) {
  mongoose.connection.db.close(function (err) {
    console.info("Disconnected from MongoDB.");
    return cb(err);
  });
};
