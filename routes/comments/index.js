var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var comments = db.get('comments');

router.route('/')
.get(function(req, res){
  comments.find({}).then(function(err, comments){
    res.json(comments);
  });
})
.post(function (req, res) {
  // POST to comments...
})

module.exports = router;
