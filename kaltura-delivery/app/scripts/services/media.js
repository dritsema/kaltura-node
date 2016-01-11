'use strict';

/**
 * @ngdoc service
 * @name kalturaSpotDeliveryApp.media
 * @description
 * # media
 * Factory in the kalturaSpotDeliveryApp.
 */
angular.module('kalturaSpotDeliveryApp')
  .factory('media', function ($resource) {

    /* all media */
    var allMediaResource = $resource(
      'http://localhost:3999/node/kaltura-service/api/v1/media/list',
      { callback: 'JSON_CALLBACK' },
      { get: { method: 'JSONP' } }
    );
    var allMedia = function () {
      return allMediaResource.get({}).$promise;
    };

    /* media item  */
    var getMediaResource = $resource(
      'http://localhost:3999/node/kaltura-service/api/v1/media/list/:id',
      {id:'@id', callback:'JSON_CALLBACK'},
      {get:{method: 'JSONP'}}
    );
    var getMedia = function (id) {
      return getMediaResource.get({id:id}).$promise;
    };


    // Public API here
    return {
      allMedia: function() {
        return allMedia();
      },
      getMedia: function(id) {
        return getMedia(id);
      }

    };
  });
