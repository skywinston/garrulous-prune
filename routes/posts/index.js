var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var comments = db.get('comments');

/* GET home page. */
router.get('/', function(req, res, next) {
  var postsPresenter = {
    posts: []
  }
  posts.find({}).then(function(posts){
    var promises = posts.map(function (post) {
      return comments.find({ 'post_id': post._id.toString() }).then(function(comments){
        comments.forEach(function(comment){
          post.comments.push(comment);
        });
        post.date = moment(post.date).fromNow();
        postsPresenter.posts.push(post);
      });
    });
    return Promise.all(promises);
  }).then(function(){
    res.json(postsPresenter.posts);
  });
});

router.post('/', function(req, res, next){
  posts.insert(req.body).then(function(post){
    res.json(post);
  });
})

router.post('/:id/update', function(req, res, next){
  posts.findAndModify({_id: req.params.id}, {$set: {votes: req.body.votes}}).then(function(update){
    res.json(update);
  });
});

module.exports = router;
