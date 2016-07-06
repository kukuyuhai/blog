/**
 * Created by kukuyuhai on 16/7/4.
 */

var Index = require('../controller/index');
var blog = require('../controller/blog');
var User = require('../controller/admin/user');

module.exports = function(app){

    app.use(function(req,res,next){
        var _user = req.session.user

        app.locals.user = _user;

        next();
    })

    app.get('/',Index.index);
    app.get('/blog',blog.blog);


    //user login
    app.get('/admin/signup',User.showSignup);

    app.post('/user/signup',User.signup);
};