/**
 * Created by kukuyuhai on 16/7/5.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);



module.exports = User;
