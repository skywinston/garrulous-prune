var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var tags = db.get('tags');

router.get('/', function(req, res){
  console.log(req.body);
})

router.post('/', function(req, res){
  console.log("POST to /tags", req.body);
  var tagsToAdd = req.body.map(function(tag){
    return tags.insert({title: tag});
  });
  Promise.all(tagsToAdd).then(function(newlyCreatedTags){
    console.log(newlyCreatedTags);
  })
})

module.exports = router;
