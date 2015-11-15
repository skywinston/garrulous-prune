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
  console.log(req.body);
  comments.insert(req.body).on('complete', function(err, comment){
    if(err){
      throw new Error("Error in POST to route /comments: ", err);
      res.status(500).send("Error in POST to route /comments: ", err)
    }
    res.json(comment);
  });
});

router.route('/:postId')
.get(function(req,res){
  comments.find({ 'post_id': req.params.postId }).then(function(err, comments){
    if(err){
      res.status(500).send("Error in GET to /:postId: ", err);
    }
    res.json(comments);
  });
})

module.exports = router;
