/**
 * Created by kukuyuhai on 16/7/4.
 */

exports.index = function(req,res){
    res.render('index',{
        title:'首页'
    })
}
exports.blog = function(req,res){
    res.render('blog',{
        title:'blog'
    })
}