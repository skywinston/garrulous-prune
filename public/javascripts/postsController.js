var app = angular.module('redditClone', ['ngAnimate']);
// app.config(function($stateProvider, $urlRouterProvider){
//   $urlRouterProvider.otherwise('/posts');
//   $stateProvider
//   .state('posts', {
//     url: '/posts',
//     templateUrl: 'partials/posts.html'
//   });
// });

app.controller('postsController', function($scope, $http){
  $http.get('/api/1/posts').then(function(response){
    $scope.posts = response.data;
  });

  var postTemplate = {
    visible: false,
    position: 0,
    votes: 0,
    newComment: {
      visible: false,
      author: '',
      content: ''
    },
    comments: [],
    tags: [],
    commentsVisible: false
  };

  var commentTemplate = {
    visible: false,
    author: '',
    content: ''
  };

  $scope.sortMethod = '-votes';
  $scope.searchPosts = '';

  $scope.newPost = {
    visible: false,
    position: 0,
    votes: 0,
    newComment: {
      visible: false,
      author: '',
      content: ''
    },
    comments: [],
    tags: [],
    commentsVisible: false
  };

  $scope.posts = [];

  $scope.postTags = [];

  var testTags = [
    {id: 1, title: "Nature"},
    {id: 2, title: "Trees"},
    {id: 3, title: "Water"},
  ];

  $scope.providePostForm = function(){
    $('#tags').selectize({
      maxItems: 10,
      create: true,
      valueField: 'title',
      labelField: 'title',
      options: testTags,
    });
    $scope.newPost.visible = true;
    document.getElementById('title').focus();
  }

  $scope.cancelNewPost = function(){
    $scope.newPost = {};
    $scope.newPost.visible = false;
  }

  $scope.createPost = function(newPost){

    var newlyCreatedPost;
    var postId;
    var tagIds;

    // Form Validations?
    if($scope.newPost.$valid){
      console.log("Valid!");
    } else {
      console.log("Not valid!");
    }

    $scope.newPost.date = moment();
    $http.post('/api/1/posts', newPost)
      .then(function(response){
        postId = response.data._id;
        response.data.date = moment(response.data.date).fromNow();
        newlyCreatedPost = response.data;
        console.log("What does the newlyCreatedPost looks like?", newlyCreatedPost);
        return $http.post('/api/1/tags', $scope.postTags);
      })
      .then(function(newlyCreatedTags){
        console.log("Newly Created Tag Objs", newlyCreatedTags.data);
        newlyCreatedPost.tags = newlyCreatedTags.data;
        var addTaggings = newlyCreatedTags.data.map(function(tagObj){
          return {post_id: postId, tag_id: tagObj._id};
        });
        return $http.post('/api/1/tagging', addTaggings);
      })
      .then(function(newlyCreatedTaggings){
        $scope.posts.push(newlyCreatedPost);
        // resest the newPost object in scope;
        $scope.newPost = {
          visible: false,
          position: 0,
          votes: 0,
          newComment: {
            visible: false,
            author: '',
            content: ''
          },
          comments: [],
          tags: [],
        };
      });
  }

  $scope.upvote = function(clickedPost){
    $scope.posts.forEach(function(post){
      if(post._id === clickedPost._id){
        post.votes++;
        $http.post('/api/1/posts/'+clickedPost._id+'/update', clickedPost).then(function(response){
          console.log(response.data);
        });
      }
    });
  }

  $scope.downvote = function(clickedPost){
    console.log("before downvote:", clickedPost);
    clickedPost.votes--;
    console.log("after downvote:", clickedPost);
    console.log(clickedPost.votes);
    $http.post('/api/1/posts/'+clickedPost._id+'/update', clickedPost).then(function(response){
      if(response.data !== 1){
        throw new Error('DB update failed!');
      }
    });
  }

  $scope.newCommentForm = function(newComment){
    newComment.visible = true;
  }

  $scope.cancelComment = function (newComment) {
    newComment.visible = false;
  }

  $scope.postComment = function(post){
    post.newComment.date = moment();
    post.newComment.visible = false;
    post.newComment.post_id = post._id;
    $http.post('/api/1/comments', post.newComment).then(function(response){
      post.comments.push(response.data);
      post.newComment.author = '';
      post.newComment.content = '';
      post.newComment.post_id = '';
      post.newComment.date = '';
    });
  }

});
