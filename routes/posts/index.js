var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var comments = db.get('comments');

/* GET home page. */
router.get('/', function(req, res, next) {
  posts.find({}).then(function(posts){
    console.log(posts);
    res.json(posts);
  });
});

router.post('/', function(req, res, next){
  posts.insert(req.body).then(function(post){
    console.log("Post inserted into db: ", post);
    res.json(post)
  });
})

router.post('/:id/update', function(req, res, next){
  // console.log(req.body);
  posts.updateById(req.params.id, req.body).then(function(update){
    res.json(update);
  });
});

module.exports = router;
