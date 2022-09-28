"use strict";

/**
 * Module dependencies
 */
var acl = require("acl2");

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ["guest", "user", "admin"],
      allows: [
        {
          resources: [
            "/api/auth/me",
            "/api/auth/signup",
            "/api/auth/signin",
            "/api/auth/logout",
            "/api/auth/forgetPsw",
            "/api/auth/resetPsw",
          ],
          permissions: "*",
        },
      ],
    },
    {
      roles: ["admin"],
      allows: [
        {
          resources: "/api/users",
          permissions: "*",
        },
        {
          resources: "/api/users/:userId",
          permissions: "*",
        },
      ],
    },
  ]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = req.user ? req.user.roles : ["guest"];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send("Unexpected authorization error");
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: "You are not authorized to this resource",
        });
      }
    }
  });
};
