"use strict";
var listingPolicy = require("../policies/listing");
var controller = require("../controllers/listing");

module.exports = function (app) {
  app.route("/api/amzListings").all(listingPolicy.isAllowed).get(controller.list).post(controller.generate);
};
