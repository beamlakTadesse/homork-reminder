var express = require('express');
var bodyParser = require('body-parser');
const _ = require("lodash");
const scheduleLib = require("node-schedule");
const firebaseAdmin = require("../firebaseAdmin");
const cors = require('cors');

const HomeWork = require('../models/homeWork');
const auth = require('../authentication');
const Notification = require('../models/notifications');
const route = express.Router();
const User = require('../models/user');
const { forEach } = require('lodash');
const passport = require('passport');


route.get('/', (req, res, next) => {
    HomeWork.find({})
        .then((homeworks) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(homeworks);
        }, (err) => next(err))
        .catch((err) => next(err));
});
//TODO: add verification of user
route.post('/' ,(req, res, next) => {
    HomeWork.create(req.body)
        .then((homework) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(homework);
            console.log("............" + homework.submitionDate.getDate());
            const schedule = {};
            schedule.createSchedule = async function (homework) {
                const scheduledNotification = new ScheduledNotification({
                    date: homework.submitionDate,
                    notification: {
                        title: homework.title,
                        body: homework.subject
                    }

                });
                scheduledNotification.save();
                scheduleLib.scheduleJob(homework.submitionDate, () => {
                    const payload = {
                        title: homework.title,
                        body:  homework.subject,
                    };
                    return firebaseAdmin.sendMulticastNotification(payload);

                });
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});


route.get('/:id',(req, res, next) => {
    HomeWork.findById(req.params.id)
        .then((homework) => {
            console.log('...........................' + homework);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(homework);
        }, (err) => next(err))
        .catch((err) => {
            res.json(err);
            next(err);});
});
route.post('/:id', (req, res, next) => {
    res.statusCode = 403;
    res.end("POST not supported!");
})

    .put('/:id', cors(),(req, res, next) => {
        HomeWork.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then((homework) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(homework);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete('/:id', cors(), (req, res, next) => {
        HomeWork.findByIdAndRemove(req.params.id)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = route;