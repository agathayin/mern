"use strict";

var fs = require("fs");

module.exports = {
  app: {
    title: "Listing4D",
    description: "Full-Stack JavaScript with MongoDB, Express, React, and Node.js",
    keywords: "mongodb, express, react, node.js, mongoose, passport",
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || "GOOGLE_ANALYTICS_TRACKING_ID",
  },
  secure: {
    ssl: true,
    privateKey: "./config/sslcerts/key.pem",
    certificate: "./config/sslcerts/cert.pem",
    caBundle: "./config/sslcerts/cabundle.crt",
  },
  db: {
    uri:
      process.env.MONGOHQ_URL ||
      process.env.DB_URI ||
      "mongodb://" + (process.env.DB_1_PORT_27017_TCP_ADDR || "localhost") + "/listing-dev",
    debug: process.env.MONGODB_DEBUG || false,
  },
  port: process.env.PORT || 8090,
  host: process.env.HOST || "0.0.0.0",
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 7200 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false,
    proxy: true,
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || "MERN",
  // sessionKey is the cookie session name
  sessionKey: "sessionId",
  sessionCollection: "sessions",
  illegalUsernames: [
    "meanjs",
    "administrator",
    "password",
    "admin",
    "user",
    "unknown",
    "anonymous",
    "null",
    "undefined",
    "api",
  ],
};
