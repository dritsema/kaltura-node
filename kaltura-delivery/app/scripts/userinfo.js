(function() {
  'use strict';
angular.module('kalturaSpotDeliveryApp').directive('userInfo', function() {
    return {
      restrict : 'A',
     // scope :{},
      template: 'Logged in user details  <b>{{name}}</b>',
      controller: ['$rootScope','$scope','$timeout',function($rootScope,$scope,$timeout) {
         $timeout(function() {
          $scope.name = $rootScope.userInfo ?JSON.stringify($rootScope.userInfo):'';
        }, 2000); // delay 2sec

  	  }]
    };
  });
})();
