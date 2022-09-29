"use strict";

/**
 * Module dependencies.
 */
const config = require("./config.js");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const _ = require("lodash");
const passport = require("passport");
const cors = require("cors");
const MongoStore = require("connect-mongo");

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + "://" + req.hostname;
    res.locals.url = req.protocol + "://" + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Environment dependent middleware
  if (process.env.NODE_ENV === "development") {
    // Disable views cache
    app.set("view cache", false);
  } else if (process.env.NODE_ENV === "production") {
    app.locals.cache = "memory";
  }
  app.enable("trust proxy");
  app.use(
    cors({
      methods: ["GET", "POST"],
      credentials: true, // allow session cookie from browser to pass through
    })
  );
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 }));
  // Add the cookie parser middleware
  app.use(cookieParser());
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // app.set("trust proxy", 1);
  app.use(
    session({
      saveUninitialized: false,
      resave: false,
      secret: config.sessionSecret,
      cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl,
      },
      name: config.sessionKey,
      store: MongoStore.create({
        client: db.connection.getClient(),
        collectionName: config.sessionCollection,
      }),
    })
  );
};

/**
 * Configure Helmet headers configuration for security
 */
module.exports.initHelmetHeaders = function (app) {
  // six months expiration period specified in seconds
  var SIX_MONTHS = 15778476;

  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(
    helmet.hsts({
      maxAge: SIX_MONTHS,
      includeSubDomains: true,
      force: true,
    })
  );
  app.disable("x-powered-by");
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // front end
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../../client/build")));
    // app.get("*", (req, res) => {
    //   res.sendFile(path.resolve(__dirname, "../../client", "build", "index.html"));
    // });
  } else {
    app.use(express.static(path.resolve(__dirname, "../../client/build")));
  }
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect("/server-error");
  });
};

/**
 * Configure Socket.io
 */
// module.exports.configureSocketIO = function (app, db) {
//   // Load the Socket.io configuration
//   var server = require("./socket.io")(app, db);

//   // Return server object
//   return server;
// };

module.exports.initPassport = function (app) {
  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, "./strategies/**/*.js")).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    require("mongoose")
      .model("User")
      .findOne(
        {
          _id: id,
        },
        "-salt -password",
        function (err, user) {
          done(err, user);
        }
      );
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);

  this.initPassport(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  // app = this.configureSocketIO(app, db);

  return app;
};
