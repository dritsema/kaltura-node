'use strict';

/**
 * @ngdoc function
 * @name kalturaSpotDeliveryApp.controller:MainCtrl
 * @description
 * # PlaylistCtrl
 * Controller of the kalturaSpotDeliveryApp
 */
angular.module('kalturaSpotDeliveryApp')
  .controller('PlaylistCtrl', function ($scope,$routeParams,playlist,media) {
    if ($routeParams.id) {
      playlist.getPlaylist($routeParams.id).then(function (result) {
          // console.log('Playlist Controller: ', JSON.stringify(result.result));
          console.table(result.result);
          $scope.getPlaylist = result.result;
      },  function (err) {
            console.log(err);
      });
    } else {
      playlist.allPlaylists().then(function (result) {
         console.table(result.result);
         $scope.allPlaylists = result;
      }, function (err) {
         console.log(err);
      });
    }
    if ($routeParams.id) {
      media.getMedia($routeParams.id).then(function (result) {
          console.table(result.result);
          $scope.getMedia = result.result;
      },  function (err) {
            console.log(err);
      });
    } else {
      media.allMedia().then(function (result) {
         console.table(result.result);
         $scope.allMedia = result;
      }, function (err) {
         console.log(err);
      });
    }
  });
