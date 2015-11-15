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
    comments: []
  };

  var commentTemplate = {
    visible: false,
    author: '',
    content: ''
  };

  $scope.newPost = {
    visible: false,
    position: 0,
    votes: 0,
    newComment: {
      visible: false,
      author: '',
      content: ''
    },
    comments: []
  };

  $scope.posts = [];

  $scope.newPostForm = function(){
    $scope.newPost.visible = true;
    document.getElementById('title').focus();
  }

  $scope.cancelNewPost = function(){
    $scope.newPost = {};
    $scope.newPost.visible = false;
  }

  $scope.createPost = function(newPost){
    console.log(newPost);
    $scope.newPost.date = moment();
    $http.post('/api/1/posts', newPost).then(function(response){
      $scope.posts.push(response.data);
      $scope.newPost = {
        visible: false,
        position: 0,
        votes: 0,
        newComment: {
          visible: false,
          author: '',
          content: ''
        },
        comments: []
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
    $scope.posts.forEach(function(post){
      if(post._id === clickedPost._id){
        post.votes--;
        $http.post('/api/1/posts/'+clickedPost._id+'/update', clickedPost).then(function(response){
          if(response.data !== 1){
            throw new Error('DB update failed!');
          }
        });
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
