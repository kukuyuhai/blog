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
    app.get('/admin/userList',User.signinRequired,User.adminRequired,User.userlist);
    app.delete('/admin/user/list',User.signinRequired,User.adminRequired,User.deleteUser);


    // category
    app.get('/admin/category',User.signinRequired,User.adminRequired,Category.list);
    app.post('/admin/category/new',User.signinRequired,User.adminRequired,Category.save);
    app.delete('/admin/category/list',User.signinRequired,User.adminRequired,Category.del);

    //blog
    app.get('/admin/blogPost',User.signinRequired,User.adminRequired,Blog.new);
    app.get('/admin/pageList',User.signinRequired,User.adminRequired,Blog.list);
    app.post('/admin/blog/post',User.signinRequired,Blog.savePoster,Blog.save);
    app.delete('/admin/blog/list',User.signinRequired,User.adminRequired,Blog.del);
    app.get('/blog',Blog.blog);
    app.get('/admin/blog/update/:id',User.signinRequired,User.adminRequired,Blog.update);
    app.get('/blog/:id',Blog.detail);
    app.get('/layout',User.layout)

};