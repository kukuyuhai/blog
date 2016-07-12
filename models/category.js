/**
 * Created by kukuyuhai on 16/7/8.
 */
var mongoose = require('mongoose');
var CategorySchema = require('../schema/category');
var Category = mongoose.model('Category',CategorySchema);



module.exports = Category;