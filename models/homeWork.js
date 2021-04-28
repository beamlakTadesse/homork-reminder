const mongoose = require('mongoose');

const homeWorkSchema = mongoose.Schema({
    title:{
        type:String,
        required:"Must provide title of the home work",
    },
    subject:{
        type:String,
        required:"Must provide subject of the home work",
    },
    homeworkDate:{
        type:Date,
        default:Date.now
    },
    submitionDate:{
        type:Date,
        require:"Submition date must be provided."
    },
    priority:{
        type:Number,
        min:0,
        max:10
    },
    progress:{
        type:Number,
        min:0,
        max:10
    },
    state:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model('HomeWork',homeWorkSchema);