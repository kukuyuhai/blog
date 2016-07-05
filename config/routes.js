/**
 * Created by kukuyuhai on 16/7/4.
 */

var Index = require('../controller/index');
var blog = require('../controller/blog');

module.exports = function(app){
    app.get('/',Index.index);
    app.get('/blog',blog.blog)

};