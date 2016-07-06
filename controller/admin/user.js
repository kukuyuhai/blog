/**
 * Created by kukuyuhai on 16/7/4.
 */
var mongoose = require('mongoose');
var User = require('../../models/user.js');


exports.showSignin = function(req,res) {
    res.render('admin/signin',{
        title: '登录页面'
    })
};

exports.showSignup = function(req,res) {
    res.render('admin/signUp', {
        title: '注册页面'
    })
}


exports.signup  = function(req,res) {


    var _user = req.body.user;
    console.log(_user);

    User.findOne({name:_user.name},function(err,user){
        if(err) console.log(err)
        if(user){
            return res.redirect('/')
        }else{
            user = new User(_user)
            user.save(function(err,user){
                if (err) console.log(err)

                res.redirect('/')
            })

        }
    })
}

exports.signin = function(req,res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name},function(err,user){
        if(err) {
            console.log(err)
        }
        //判断user是否存在，如果不存在跳转到注册页面
        if(!user) {
            return res.redirect('/admin/signup');
        }
//        比较密码是否匹配
        user.comparePassword(password,function(err,isMatch){
              if(err) console.log(err)
              if (isMatch) {
                  req.session.user  = user;
                  return res.redirect('/blog')
              }else{
                  return res.redirect('/signin');
              }
        })
    })
}

exports.layout = function(req,res){
    delete req.session.user
    res.redirect('/admin/signin')
}


//userlist

exports.userlist = function(req,res){
    User.fetch(function(err,users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist',{
            title:'用户列表',
            users:users
        })
    })
}

//middleware for user
exports.signinRequired = function(req,res,next) {
    var user = req.session.user

    if(!user) {
        return res.redirect('/admin/signin')
    }
    next()
}

exports.adminRequired = function(req,res,next){
    var user = req.session.user;

    if(user.role <= 10) {
        return res.redirect('/admin/signin')
    }

    next()
}