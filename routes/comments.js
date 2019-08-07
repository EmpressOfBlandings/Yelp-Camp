var express = require("express"),
middleware = require("../middleware"),
Comment = require("../models/comment"),
Campground = require("../models/campground"),
router = express.Router({mergeParams: true});

//NEW - display new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//CREATE - create new comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Unable to find campground");
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Unable to create comment");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment created successfully");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT - display edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

//UPDATE - update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err){
            req.flash("error", "Unable to update comment");
            console.log(err);
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY - destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            req.flash("error", "Unable to delete comment");
            console.log(err);
        } else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;