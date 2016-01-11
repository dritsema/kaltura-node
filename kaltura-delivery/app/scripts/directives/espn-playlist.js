
'use strict';

angular.module('kalturaSpotDeliveryApp')
  .directive('espn-playlist', function () {
    return {
      templateUrl: 'views/directives/espn-playlist.html',
      scope: {
        playlistData: '='
      },
      restrict: 'E',
      link: function postLink() {
        console.log('espn-playlist directive link function called');
      }
    };
  });
