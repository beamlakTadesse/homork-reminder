const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    date:{
        type:Date,
    },
    notification: {},
    });
const ScheduledNotification = mongoose.model("scheduledNotification", schema);
module.exports = ScheduledNotification;