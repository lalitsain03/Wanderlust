const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middeware.js");
const userController = require("../controllers/users.js");
const { unsubscribe } = require("./listing.js");


router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));


// router.get("/signup", userController.signupForm);

// router.post("/signup", wrapAsync(userController.signup));

//login route

router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login))

// router.get("/login", userController.loginForm)

// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login))

//logout
router.get("/logout", userController.logout)
module.exports = router;