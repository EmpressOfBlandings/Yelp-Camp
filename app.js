var express           = require("express"),
    app               = express(),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    methodOverride    = require("method-override"),
    session           = require("express-session"),
    flash             = require("connect-flash"),
    moment            = require("moment"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    indexRoutes       = require("./routes/index"),
    campgroundRoutes  = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    User              = require("./models/user");

//connect to mongodb
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

//basic app setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.locals.moment = moment;
app.use(flash());

//create express session
app.use(session({
    secret: "Secret Password",
    resave: false,
    saveUninitialized: false
}));

//passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set local variables
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//listen at port 3000
app.listen(3000, function(err) {
    console.log("Server Started")
});