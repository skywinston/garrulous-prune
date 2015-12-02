var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var posts = db.get('posts');
var tags = db.get('tags');
var tagging = db.get('tagging');

router.get('/', function(req, res){

})

router.post('/', function(req, res){
  var taggingsToInsert = req.body.map(function(insertion){
    return tagging.insert(insertion);
  });
  Promise.all(taggingsToInsert)
  .then(function(newlyCreatedTaggings){
    res.json(newlyCreatedTaggings);
  });
})

module.exports = router;
