var express = require("express"),
middleware = require("../middleware"),
Campground = require("../models/campground"),
router = express.Router();

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - display all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
        }
    })
});

//NEW - display new campground form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE - create new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    // geocoder.geocode(req.body.location, function(err, data) {
    //     if(err || !data.length) {
    //         console.log(err);
    //         req.flash("error", "Invalid address");
    //         return res.redirect("back");
    //     }
    // req.body.campground.lat = data[0].latitude;
    // req.body.campground.lng = data[0].longitude;
    // req.body.campground.location = data[0].formattedAddress;

        Campground.create(req.body.campground, function(err, campground) {
            if(err) {
                console.log(err);
                req.flash("error", "Unable to create campground");
            } else {
                campground.author.id = req.user._id;
                campground.author.username = req.user.username;
                campground.save();
                req.flash("success", "Campground created successfully");
                res.redirect("/campgrounds");
            }
        });
    });
// });

//SHOW - display selected campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

//EDIT - display edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

//UPDATE - update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // geocoder.geocode(req.body.location, function (err, data) {
    //     if (err || !data.length) {
    //         console.log(err);
    //         req.flash('error', 'Invalid address');
    //         return res.redirect('back');
    //     }
    //     req.body.campground.lat = data[0].latitude;
    //     req.body.campground.lng = data[0].longitude;
    //     req.body.campground.location = data[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
            if(err) {
                req.flash("error", "Unable to update campground");
                res.redirect("back");
                console.log(err);
            } else { 
                req.flash("success", "Campground updated successfully");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
// });

//DESTROY - delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Unable to delete campground");
            console.log(err);
        } else {
            req.flash("success", "Campground deleted successfully");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;