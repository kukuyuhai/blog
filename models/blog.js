/**
 * Created by kukuyuhai on 16/7/8.
 */

var mongoose = require('mongoose');
var BlogSchema = require('../schema/blog');
var Blog = mongoose.model('Blog',BlogSchema);



module.exports = Blog;