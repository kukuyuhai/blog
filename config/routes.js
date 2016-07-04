/**
 * Created by kukuyuhai on 16/7/4.
 */

var Index = require('../controller/index');

module.exports = function(app){
    app.get('/',Index.index)

}