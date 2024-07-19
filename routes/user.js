const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const user=require("../models/user.js");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signUp")
.get(userController.signupform)
.post(wrapAscync(userController.signup));


// router.get("/signUp",userController.signupform);
// router.post("/signUp", wrapAscync(userController.signup));
router.route("/login")
.get(userController.loginform)
.post(saveRedirectUrl, passport.authenticate('local', { 
    failureRedirect: "/users/login", 
    failureFlash: true 
}), userController.login);

// router.get("/login",userController.loginform);
// router.post("/login",saveRedirectUrl, passport.authenticate('local', { 
//     failureRedirect: "/users/login", 
//     failureFlash: true 
// }), userController.login);

router.get("/logout",userController.logout);

module.exports=router;