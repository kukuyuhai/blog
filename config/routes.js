/**
 * Created by kukuyuhai on 16/7/4.
 */


var Blog = require('../controller/admin/blog');
var User = require('../controller/admin/user');
var Category = require('../controller/admin/category');
var adminIndex = require('../controller/admin/index');

module.exports = function(app){

    app.use(function(req,res,next){
        var _user = req.session.user;

        app.locals.user = _user;

        next();
    });

    //app.get('/',Index.index);
    //app.get('/blog',Blog.blog);

    //  user login
    app.get('/admin/signin',User.showSignin);

    app.post('/user/signin',User.signin);

    app.post('/user/signup',User.adminRequired,User.signup);

    //   admin index render
    app.get('/admin/index',User.signinRequired,adminIndex.adminIndex);
    app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.userlist);
    app.delete('/admin/user/list',User.signinRequired,User.adminRequired,User.deleteUser);


    // category
    app.get('/admin/category',User.signinRequired,User.adminRequired,Category.list);
    app.post('/admin/category/new',User.signinRequired,User.adminRequired,Category.save)

    //blog
    app.get('/admin/blogpost',User.signinRequired,User.adminRequired,Blog.new);
    app.post('/admin/blog/post',User.signinRequired,User.adminRequired,Blog.savePoster,Blog.save)
    app.get('/layout',User.layout)

};