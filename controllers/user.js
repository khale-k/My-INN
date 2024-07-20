const user=require("../models/user.js");


module.exports.signupform=(req,res)=>{
    res.render("users/signUp");
}

module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to INNSecure!!");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
}

module.exports.loginform=(req,res)=>{
    res.render("users/login");
}

module.exports.login=(req, res) => {
    req.flash('success', `Welcome back!   ${req.user.username}`);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You are logged out now !!");
        res.redirect("/listings");
    })
}
