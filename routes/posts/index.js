var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var comments = db.get('comments');
var tags = db.get('tags');
var tagging = db.get('tagging');

/* GET home page. */
router.get('/', function(req, res, next) {

  var postsPresenter = {
    posts: []
  }

  posts.find({}).then(function(posts){
    postsPresenter.posts = posts;
    var promises = posts.map(function (post) {
      return comments.find({ 'post_id': post._id.toString() }).then(function(comments){
        comments.forEach(function(comment){
          comment.date = moment(comment.date).fromNow();
          post.comments.push(comment);
        });
        post.date = moment(post.date).fromNow();
        postsPresenter.posts.push(post);
      });
    });
    return Promise.all(promises);
  }).then(function(){
    var getTagsPerPost = postsPresenter.posts.map(function(post){
      return tagging.find({post_id: post._id.toString()}).then(function(taggingsWithPostId){
        var tagLookup = taggingsWithPostId.map(function(taggingObj){
          return tags.findOne({_id: taggingObj.tag_id.toString()}).then(function(tagsPerPost){
            post.tags.push(tagsPerPost);
            // console.log("the post", post);
            // console.log("postPresenter Object", postsPresenter);
          });
        });
      });
    });
    Promise.all(getTagsPerPost).then(function(){
      res.json(postsPresenter);
    });
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
