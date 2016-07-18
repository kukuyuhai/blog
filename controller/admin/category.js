/**
 * Created by kukuyuhai on 16/7/8.
 */

var Category = require('../../models/category.js');
var Blog = require('../../models/blog.js');


exports.save = function(req,res){
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err,category){
        if(err){
            console.log(err)
        }

        res.redirect('/admin/category')
    })
}

exports.list = function(req,res){
     var name = req.session.user.name;
     Category.fetch(function(err,categories){
         if(err){
             console.log(err)
         }

         res.render('admin/categorylist',{
             title:'文章分类列表',
             categories:categories,
             name:name
         })
     })
}

exports.del = function(req,res){
    var id = req.query.id;
    if(id) {
        Blog.remove({category:id},function(err,blog){
            if(err) console.log(err)
        })
        Category.remove({_id:id},function(err,category){
            if(err) {
                console.log(err)
                res.json({success:0})
            }else{
                res.json({success:1})
            }
        })

    }

}


