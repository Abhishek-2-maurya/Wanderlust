const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/user.js");

router.get("/logout", userControllers.logout);

router.route("/signup")
.get(userControllers.renderSignupform)
.post(asyncWrap(userControllers.signup))

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: 'login', failureFlash: true }),
userControllers.login
)




module.exports = router;