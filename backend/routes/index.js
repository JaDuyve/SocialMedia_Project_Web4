var express = require('express');
var router = express.Router();
var multer = require('multer');
let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Comment = mongoose.model('Comment');
let jwt = require('express-jwt');

let DIR ='./uploads/images/';

let upload = multer ({dest: DIR}).single('photo');

let auth = jwt({ secret: process.env.STUDYBUD_BACKEND_SECRET });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('server is up');
});

router.get('/API/questions',  function (req, res, next) {
  let query = Question.find().populate('comments');
  query.exec(function (err, questions) {
    if (err) {
      return next(err);
    }

    res.json(questions);
  });
});

router.get('/API/question/:question',  function (req, res, next) {
  res.json(req.question);
});

router.post('/API/questions', function (req, res, next) {
  Comment.create(req.body.comments, function (err, comm) {
    if (err) {
      return next(err);
    }

    let question = new Question({
      description: req.body.description,
      created: req.body.created,
      author: req.body.author,
      likes: req.body.likes,
      dislikes: req.body.dislikes
    });

    question.comments = comm;
    question.save(function (err, q) {
      if (err) {
        // removing comments because we are in a error
        Comment.remove({ _id: { $in: question.comments } });
        return next(err);
      }

      res.json(q);
    });
  });
});

router.param('question', function (req, res, next, id) {
  let query = Question.findById(id);
  query.exec(function (err, question) {
    if (err) {
      return next(err);
    }
    if (!question) {
      return next(new Error('not found ' + id));
    }
    req.question = question;
    return next();
  });
});

router.param('comment', function (req, res, next, id) {
  let query = Comment.findById(id);
  query.exec(function (err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error('not found ' + id));
    }
    req.comment = comment;
    return next();
  });
});

router.delete('/API/question/:question', function (req, res) {
  Comment.remove({ _id: { $in: req.question.comments } }, function (err) {
    if (err) return next(err);
    req.question.remove(function (err) {
      if (err) {
        return next(err);
      }
      res.json(req.question);
    });
  });
});

router.put('/API/question/:question',  function (req, res) {
  let question = new Question(req.body);

  question.save(function (err) {
    if (err) {
      return next(err);
    }
    res.json(req.body);
  });
});

router.post('/API/question/:question/comments',  function (req, res, next) {
  let com = new Comment(req.body);

  com.save(function (err, comment) {
    if (err) {
      return next(err);
    }

    req.question.comments.push(comment);

    req.question.save(function (err, question) {
      if (err) {
        return next(err);

      }
      res.json(comment);
    });
  });
});

router.post('/API/comment/:comment/comments', function (req, res, next) {
  let com = new Comment(req.body);

  com.save(function (err, comment) {
    if (err) {
      return next(err);
    }

    req.comment.comments.push(comment);

    req.comment.save(function (err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    })
  });
});

router.get('/API/group/:group',  function (req, res, next) {
  res.json(req.group);
});

router.post('/API/groups', function (req, res, next) {

    let group = new Group({
      
    });
    console.log(Group);

    group.questions = [];
    group.users = [];
    question.save(function (err, group) {
      if (err) {
        // removing questions because we are in a error
        return next(err);
      }

      res.json(group);
    });
  
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

// Uploading picture
router.post('/API/uploadfile', function(req, res, next){
  let path ='';
  upload(req, res, function(err){
    if (err){
      console.log(err);
      return res.status(422).send("an Error occured ");
    }
    path = req.file.path;
    return res.send("Upload completed for " + path);
  });
})

module.exports = router;
