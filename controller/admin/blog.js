
/**
 *
 *
 * Created by kukuyuhai on 16/7/8.
 */

var Blog = require('../../models/blog.js');
var Category = require('../../models/category.js');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');



exports.new = function(req,res){
    Category.find({},function(err,categories){
        res.render('admin/blogpost',{
            categories:categories,
            blog:{}
        })
    })
}

exports.save = function(req,res){
    var blogObj = req.body.blog;
    var categoryId = blogObj.category;
    var categoryName = blogObj.categoryName;
    if(req.poster) {
        blogObj.poster = req.poster;
        console.log(blogObj.poster);
    }

    var _blog = new Blog(blogObj);

    _blog.save(function(err,blog){
        if(err){
            console.log(err);
        }

        console.log(blog)
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
                    res.redirect('/blog'+blog._id);
                })
            })
        }
    })
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


