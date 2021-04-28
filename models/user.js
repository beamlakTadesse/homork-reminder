const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose'); 
const userSchema  = mongoose.Schema({
    username:{
        type:String,
        required:"username must be provided.",
        unique:true
    },
    name:{
        type:String,
        required:"name must be provided."
    },
    email:{
        type:String,
        required:"email must be provided.",
        unique:true
    },
    img:
    {
        type: Buffer,
      
    }
});
userSchema.plugin(passportLocalMongoose); 
module.exports = mongoose.model('User',userSchema);