"use strict";

/**
 * Module dependencies.
 */
const _ = require("lodash");
const chalk = require("chalk");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const config = require("./env.js");
const assets = require("./assets.js");
const pkg = require("../../package.json");

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], "");
              }
            }
          } else {
            file = file.replace(excludes, "");
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/** Validate config.domain is set
 */
var validateDomainIsSet = function (config) {
  if (!config.domain) {
    console.log(
      "+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app."
    );
  }
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Appending files
  config.files = {
    server: {},
    client: {},
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.routes);

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.policies);
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // read package.json for MEAN.JS project information
  config.pkg = pkg;

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Print a warning if config.domain is not set
  validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
