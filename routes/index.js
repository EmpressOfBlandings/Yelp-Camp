var express = require("express"),
passport = require("passport"),
User = require("../models/user"),
router = express.Router();

//landing page
router.get("/", function(req, res) {
    res.render("landing");
});

//display register form
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

//register new user
router.post("/register", function(req, res) {
    var user = new User({username: req.body.username});
    User.register(user, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Successfully Signed Up! Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//display login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"})
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Successfully Logged In!" ,
    failureFlash: "Wrong username or password. Try Again."
}));

//logout user
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;