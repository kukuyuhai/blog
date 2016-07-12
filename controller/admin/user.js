/**
 * Created by kukuyuhai on 16/7/4.
 */

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
    var newUser = {
        name:_user.name,
        password:_user.password,
        role:_user.role
    }
    console.log(newUser);

    User.findOne({name:_user.name},function(err,user){
        if(err) console.log(err)
        if(user){
            alert("此账号已存在")
            return res.redirect('/admin/sign')

        }else{
            user = new User(newUser)
            user.save(function(err,user){
                if (err) console.log(err)
                res.redirect('/admin/userlist')
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
            return res.redirect('/admin/signin');
        }
//        比较密码是否匹配
        user.comparePassword(password,function(err,isMatch){
              if(err) console.log(err)
              if (isMatch) {
                  req.session.user  = user;
                  console.log(user)
                  return res.redirect('/admin/index');
              }else{
                  return res.redirect('/admin/signin');
              }
        })
    })
}

exports.layout = function(req,res){
    delete req.session.user
    res.redirect('/admin/signin');
}


//userlist

exports.userlist = function(req,res){
    var user = req.session.user;
    User.fetch(function(err,users) {
        if (err) {
            console.log(err)
        }
        res.render('admin/userlist',{
            title:'用户列表',
            users:users,
            name:user.name
        })
    })
}


exports.deleteUser = function(req,res){
    var id = req.query.id;
    if(id) {
        User.remove({_id:id},function(err,user){
            if(err) {
                console.log(err)
                res.json({success:0})
            }else{
                res.json({success:1})
            }

        })
    }
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

//    if(user.role < 30 && user.role > 0) {
//        return res.redirect('/admin/signin')
//    }

    next()
}