'use strict';

/**
 * @ngdoc service
 * @name kalturaSpotDeliveryApp.playlist
 * @description
 * # playlist
 * Factory in the kalturaSpotDeliveryApp.
 */
angular.module('kalturaSpotDeliveryApp')
  .factory('playlist', function ($resource) {

    /* playlists */
    var allPlaylistsResource = $resource(
      'http://localhost:3999/node/kaltura-service/api/v1/playlists',
      { callback: 'JSON_CALLBACK' },
      { get: { method: 'JSONP' } }
    );
    var allPlaylists = function () {
      return allPlaylistsResource.get({}).$promise;
    };

    /* playlist */
    var getPlaylistResource = $resource(
      'http://localhost:3999/node/kaltura-service/api/v1/playlist/:id',
      {id:'@id', callback:'JSON_CALLBACK'},
      {get:{method: 'JSONP'}}
    );
    var getPlaylist = function (id) {
      return getPlaylistResource.get({id:id}).$promise;
    };

    /* playlist execute */
    var getPlaylistExecuteResource = $resource(
      'http://localhost:3999/node/kaltura-service/api/v1/playlist/execute/:id',
      {id:'@id', callback:'JSON_CALLBACK'},
      {get:{method: 'JSONP'}}
    );
    var getPlaylistExecute = function (id) {
      return getPlaylistExecuteResource.get({id:id}).$promise;
    };


    // Public API here
    return {
      allPlaylists: function() {
        return allPlaylists();
      },
      getPlaylist: function(id) {
        return getPlaylist(id);
      },
      getPlaylistExecute: function(id) {
        return getPlaylistExecute(id);
      }

    };
  });
