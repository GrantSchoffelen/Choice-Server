'use strict';

angular.module('barApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.bars; 
    $scope.random; 
    $scope.loca;
    $scope.dealSearch = false;    
    $scope.counter = 0; 


 $scope.filter= function(){
  if($scope.dealSearch === false){
    $scope.dealSearch = true; 
  }
  else{
  $scope.dealSearch = false
}
console.log($scope.dealSearch)
 } 

$scope.generateBar = function(){
  
var index = Math.floor(Math.random() * $scope.bars.length);
$scope.random = $scope.bars[index];
$scope.bars.splice(index, 1)
$scope.counter ++
if(!$scope.random){
  $scope.loca.deal = $scope.dealSearch
  $scope.loca.offset = $scope.counter - 1; 
  $scope.wait = true; 
  $http.post('/api/yelps/yelp', $scope.loca).success(function(bars){
    console.log(bars)
      $scope.bars = bars
      $scope.generateBar()
      $scope.wait= false; 
    })

}

}

$scope.initCoords = function() {
  console.log()
  
  navigator.geolocation.getCurrentPosition(function(data){
    console.log(data, 'data')
    $scope.loca = data
    $scope.loca.offset = $scope.counter
    $scope.loca.deals = $scope.loca.dealSearch
  $http.post('/api/yelps/yelp', $scope.loca).success(function(bars){
    console.log(bars.businesses)
      $scope.bars = bars
      $scope.generateBar()
    })
    }, 

    function(err){console.log(err)})

  }

$scope.initCoords()


  });
