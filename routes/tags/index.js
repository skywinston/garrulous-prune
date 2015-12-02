var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var tags = db.get('tags');

router.get('/', function(req, res){
  console.log(req.body);
})

router.post('/', function(req, res){
  var tagsToAdd = req.body.map(function(tag){
    return tags.findAndModify({title: tag}, {title: tag}, {upsert: true});
  });
  Promise.all(tagsToAdd).then(function(newlyCreatedTags){
    console.log("Newly Created Tags", newlyCreatedTags);
    res.json(newlyCreatedTags);
  });
});

module.exports = router;
