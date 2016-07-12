/**
 *
 * Created by kukuyuhai on 16/7/8.
 */

var mongoose = require('mongoose');


var blogSchema = mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    poster:String,
    pv:{
        type:Number,
        default:0
    },
//    tags:{
//      type:mongoose.Schema.Types.ObjectId,
//      ref:'tags'
//    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

blogSchema.pre('save',function(next){
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now()
    }
    next()
})

blogSchema.statics = {
    fetch:function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = blogSchema;