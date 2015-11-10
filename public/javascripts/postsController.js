var app = angular.module('redditClone', ['ngAnimate']);
app.controller('postsController', function($scope, $http){
  $http.get('/api/1/posts').then(function(response){
    $scope.posts = response.data;
    // $scope.posts = response.data.map(function(post){
    //   post.date = moment(post.date).fromNow();
    // });
  });

  $scope.newPost = {
    visible: false,
    position: 0,
    votes: 0,
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
      // $scope.newPost.date = moment(response.data.date);
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

});
