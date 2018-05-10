var express = require('express');
var router = express.Router();

let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Comment = mongoose.model('Comment');
let Group = mongoose.model('Group');
let User = mongoose.model('User');
let jwt = require('express-jwt');


let auth = jwt({ secret: process.env.STUDYBUD_BACKEND_SECRET });

router.get('group/:group', auth, function (req, res, next) {
    res.json(req.group);
});

router.param('group', function (req, res, next, id) {
    let query = Group.findById(id);
    query.exec(function (err, group) {
        if (err) {
            return next(err);
        }
        if (!group) {
            return next(new Error('not found ' + id));
        }
        req.group = group;
        return next();
    });
});

router.post('/add', auth, function (req, res, next) {


    User.findById(req.body.adminId, function (err, usr) {
        if (err) {
            return next(err);
        }

        let group = new Group({
            groupName: req.body.groupName,
            closedGroup: req.body.closedGroup,

        });

        group.admin = usr;

        group.save(function (err, g) {
            if (err) {
                // removing questions because we are in a error
                return next(err);
            }

            res.json({ 'groupadd': 'ok' })
        });
    });
});

router.post('/checkgroupname', function (req, res, next) {
    Group.findOne({ groupName: req.body.groupName },
        function (err, result) {
            if (result !== null) {
                res.json({ 'groupname': 'alreadyexists' })
            } else {
                res.json({ 'username': 'ok' })
            }
        });
});

module.exports = router;
