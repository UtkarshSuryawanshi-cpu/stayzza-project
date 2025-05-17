const User = require("../models/user.js");


module.exports.userSignUpForm =  (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.userSignUp = async (req,res) => {
    try{
    let {username, password, email} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "Welcome to Stayzza!");
        res.redirect("/listings");
    })

    // req.flash("success", "Welcome to Stayzza!");
    // res.redirect("/listings");


    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.userLogInForm =  (req,res) => {
    res.render("users/login.ejs")
};

module.exports.userLogIn = async(req,res) => {
    // res.send("welcome! you are logged in stayzza")
    req.flash("success","Welcome Back Traveller")
    // res.redirect("/listings")
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.userLogOut = (req,res,next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success", "logged out successfully")
            res.redirect("/listings")
        }
    })

};