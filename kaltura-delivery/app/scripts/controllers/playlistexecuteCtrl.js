'use strict';

/**
 * @ngdoc function
 * @name kalturaSpotDeliveryApp.controller:MainCtrl
 * @description
 * # PlaylistExecuteCtrl
 * Controller of the kalturaSpotDeliveryApp
 */
angular.module('kalturaSpotDeliveryApp')
  .controller('PlaylistExecuteCtrl', function ($scope,$routeParams,playlist) {

      playlist.getPlaylistExecute($routeParams.id).then(function (result) {
          // console.log('PlaylistExecute Controller: ', JSON.stringify(result.result));
          console.table(result.result);
          $scope.getPlaylistExecute = result.result;
      },  function (err) {
            console.log(err);
      });
  });
