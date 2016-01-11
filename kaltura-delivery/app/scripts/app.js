'use strict';

/**
 * @ngdoc overview
 * @name kalturaSpotDeliveryApp
 * @description
 * # kalturaSpotDeliveryApp
 *
 * Main module of the application.
 */
 (function () {
    'use strict';

    angular
        .module('kalturaSpotDeliveryApp', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch'])
        // .run(run);
        .config(function ($routeProvider) {
          $routeProvider
            .when('/', {
              templateUrl: 'views/main.html',
              controller: 'PlaylistCtrl'
            })
            .when('/about', {
              templateUrl: 'views/about.html',
              controller: 'AboutCtrl',
              controllerAs: 'about'
            })
            .when('/playlist/:id', {
                templateUrl: 'views/playlist.html',
                controller: 'PlaylistCtrl'
            })
            .when('/playlist/execute/:id', {
                templateUrl: 'views/playlistexecute.html',
                controller: 'PlaylistExecuteCtrl'
            })
            .when('/media/:id', {
                templateUrl: 'views/media.html',
                controller: 'PlaylistCtrl'
            })
            .otherwise({
              redirectTo: '/'
            });
        });



    run.$inject = [ '$resource','$rootScope'];
    function run($resource,$rootScope) {
        $resource('/userinfo')
                        .get(getUserInfoComplete,handleErrorOnLoad)
        function getUserInfoComplete(info, status, headers, config) {
            $rootScope.userInfo= info;
          //  alert(JSON.stringify(info));
        }
        function handleErrorOnLoad(response){
            alert('failed');
        }
    }

})();
