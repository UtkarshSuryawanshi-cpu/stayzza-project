const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js");


router.get("/signup", userController.userSignUpForm);

router.post("/signup",userController.userSignUp);

router.get("/login", userController.userLogInForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash:true }), userController.userLogIn);

router.get("/logout", userController.userLogOut);
module.exports = router;