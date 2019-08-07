var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

//create user model
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);