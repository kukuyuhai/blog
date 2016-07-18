
/**
 *
 *
 * Created by kukuyuhai on 16/7/8.
 */

var Blog = require('../../models/blog.js');
var Category = require('../../models/category.js');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

exports.blog = function(req,res){
    Category
        .find({})
        .populate({
            path:'blogs',
            select:'title poster meta summary',
            options:{limit:6}
        })
        .exec(function(err,categories){
            if(err) console.log(err)
            console.log(categories)
            res.render('blog',{
                title:'blog',
                categories:categories
            })
        })
}

exports.new = function(req,res){
    Category.find({},function(err,categories){
        res.render('admin/blogpost',{
            categories:categories,
            blog:{}
        })
    })
}

exports.save = function(req,res){
    var id = req.body.blog._id;
    var blogObj = req.body.blog;
    var _category = blogObj._category;
    var categoryId = blogObj.category;
    var categoryName = blogObj.categoryName;
    var _blog

    if(req.poster) {
        req.body.blog.poster = req.poster;
    }

    if(id) {

        Blog.findById(id,function(err,blog){
            _blog = _.extend(blog,blogObj);
            _blog.save(function(err,blog){
                if (err) {
                    console.log(err)
                }
                if(_category != categoryId || _category != categoryName){
                    Category.findById(_category,function(err,category) {
                        category.blogs.pop(blog._id);
                       category.save(function(err){})
                    })
                    if(categoryId) {
                        Category.findById(categoryId,function(err,category){
                            category.blogs.push(blog._id);
                            category.save(function(err){})
                           // res.redirect('/blog/'+blog._id);
                        })
                    }else if(categoryName){
                        var category = new Category({
                            name:categoryName,
                            blogs:[blog._id]
                        })
                        category.save(function(err,category){
                            blog.category = category._id;
                            blog.save(function(err,blog){
                               // res.redirect('/blog/'+blog._id);
                            })
                        })
                    }

                }
                res.redirect('/blog/'+ blog._id)
            })
        })
    }else{
        _blog = new Blog(blogObj);
        _blog.save(function(err,blog){
            if(err){
                console.log(err);
            }
            if(categoryId){
                Category.findById(categoryId,function(err,category){
                    category.blogs.push(blog._id)
                    category.save(function(err,category){
                        res.redirect('/blog/'+ blog._id)
                    })
                })
            }
            else if(categoryName){
                var category = new Category({
                    name:categoryName,
                    blogs:[blog._id]
                })

                category.save(function(err,category){
                    blog.category = category._id;
                    blog.save(function(err,blog){
                        res.redirect('/blog/'+blog._id);
                    })
                })
            }
        })
    }
}
//此处关联查询有两个注意点  ,populate('path',obj)==> .populate('category',{name:1,_id:0})
//        Object类型的时，格式如:{name: 1, _id: 0},为0表示不填充，为1时表示填充。
//String类型的时，格式如:"name -_id"，用空格分隔字段，在字段名前加上-表示不填充。
//注意 ，name 不能为空
exports.list = function(req,res){
    var name = req.session.user.name;
    Blog.find({})
        .populate('category','name')
        .exec(function(err,blogs){
            if(err) {
                console.log(err)
            }

            res.render('admin/pageList',{
                title:'文章列表页',
                blogs:blogs,
                name:name
            })
        })

}

exports.detail = function(req,res){
    var id  = req.params.id;
    Blog.update({_id:id},{$inc:{pv:1}},function(err){
        if(err ) {
            console.log(err)
        }
    })

    Blog.findById(id,function(err,blog){
        res.render('detail',{
            title: '详情页',
            blog:blog
        })
    })
}
exports.del = function(req,res){
    var id = req.query.id;
    if(id) {
        Blog.findById({_id:id},function(err,blog){
            var categoryId = blog.category;
            Category.findById(categoryId,function(err,category){
               if(category.blogs) {
                   category.blogs.pop(blog._id)
                    category.save(function(err){
                        if(err) console.log(err)
                   })
                   Blog.remove({_id:id},function(err,blog){
                       if(err) {
                           console.log(err)
                           res.json({success:0})
                       }else{
                           res.json({success:1})
                       }
                   })
               }
            })

        })

    }
}


exports.update = function(req,res){
   var id = req.params.id;
   if(id) {
       Blog.findById(id,function(err,blog){
           Category.find({},function(err,categories){
               res.render('admin/blogPost',{
                   title:'blog 更新页',
                   blog:blog,
                   categories:categories
               })
           })
       })
   }
}
exports.savePoster = function(req,res,next){
    var postData = req.files.inputFile;
    var filePath = postData.path;
    var originalFilename = postData.originalFilename;
    if(originalFilename) {
        fs.readFile(filePath,function(err,data) {
            var time = Date.now();
            var type = postData.type.split('/')[1];
            var poster = time + '.' +type;
            var newPath = path.join(__dirname,'../../','/public/upload/'+ poster)
            console.log(newPath)

            fs.writeFile(newPath,data,function(err){
                req.poster = poster;
                next();
            })
        })
    }else{
        next();
    }
}
