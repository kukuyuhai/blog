/**
 * Created by kukuyuhai on 16/7/8.
 */

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name:String,
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }],
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

})

CategorySchema.pre('save',function(next){
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now()
    }
    next()
})

CategorySchema.statics = {
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

module.exports = CategorySchema;
