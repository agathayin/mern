"use strict";

const assets = {
  models: "server/modules/*/models/**/*.js",
  routes: ["server/modules/!(core)/routes/**/*.js", "modules/core/server/routes/**/*.js"],
  policies: "server/modules/*/policies/*.js",
};
module.exports = assets;
