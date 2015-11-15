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
    console.log(response.data);
    $scope.posts = response.data;
  });

  $scope.newPost = {
    visible: false,
    position: 0,
    votes: 0,
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
        votes: 0
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

  $scope.newComment = {
    visible: false,
    author: '',
    comment: ''
  }

  $scope.newCommentForm = function(){
    $scope.newComment.visible = true;

  }

  $scope.cancelComment = function () {
    $scope.newComment.visible = false;
  }

  $scope.postComment = function(newComment){
    $scope.newComment.date = moment();
    $http.post('/api/1/comments', newComment).then(function(response){
      console.log(response);
    })
  }

});
