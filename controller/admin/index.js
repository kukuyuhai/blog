/**
 * Created by kukuyuhai on 16/7/7.
 */
var User = require('../../models/user.js');

exports.adminIndex = function(req,res){
    var user = req.session.user;

    res.render('admin/index',{
        title:'管理台',
        name:user.name
    })

}