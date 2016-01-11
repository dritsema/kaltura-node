'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
chalk = require('chalk'),
rest = require('restler'),
bodyParser = require('body-parser'),
config = require('./properties.loader'),

kaltura = require('../../lib/KalturaClient.js'),
kalturaTypes = require('../../lib/KalturaTypes.js'),
vo = require('../../lib/KalturaVO.js'),
xml2js = require('xml2js');

var partnerId = config.partnerId;
var conf = new kaltura.KalturaConfiguration(partnerId);
conf.serviceUrl = "http://www.kaltura.com";

module.exports = function() {
    var client = new kaltura.KalturaClient(conf);
    var secret = config.secret;
    var userId = config.userId;
    var type = kalturaTypes.KalturaSessionType.ADMIN;

    var app = express();
    var router = express.Router();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    client.session.start(function(ks) {
      if (ks.code && ks.message) {
        console.log('Error starting session', success, ks);
      } else {
        console.log('ks: ', ks);
        client.setKs(ks);
      }
    }, secret,
    userId,
    type,
    partnerId)

    var expiry = 100000;
    var privileges = null;

    // client.session.start(cb, secret, userId, type, partnerId, expiry, privileges);

    // id = category id
    router.route('/media/list/:id').get( function(req, res) {
      //var filter = null;
      //var pager = null;
      var id = req.params.id || null;
      console.log('category id: ', id);

        client.media.get(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaPlayListResponseById', {result: results})
          }
        }
        ,id
        //,filter,pager
      );
    });

    router.route('/media/list').get( function(req, res) {
      client.media.listAction(function(results) {
        if (results && results.code && results.message) {
          console.log('Kaltura Error', results);
          // res.json(results.message);
          res.type('application/json');
          res.status(500).jsonp(results.message);
        } else {
          res.type('application/json');
          // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
          res.status(500).jsonp('KalturaMediaListResponse', {result: results.objects})
        }
      });
    });

    router.route('/playlist/:id').get( function(req, res) {
      //var filter = null;
      //var pager = null;
      var id = req.params.id || null;
      console.log('playlist id: ', id);

        client.playlist.get(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaPlayListResponseById', {result: results})
          }
        }
        ,id
        //,filter,pager
      );
    });

    // client.playlist.execute(cb, id, detailed, playlistContext, filter, pager);
    router.route('/playlist/execute/:id').get( function(req, res) {
      var filter = null;
      var pager = null;
      var detailed = null;
      var playlistContext = null;

      var id = req.params.id || null;
      console.log('playlist id: ', id);

        client.playlist.execute(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaPlayListResponseById', {result: results})
          }
        }
        ,id
        //,detailed, playlistContext, filter, pager
      );
    });

    router.route('/playlists').get( function(req, res) {
      //var filter = null;
      //var pager = null;
      console.log('playlists');

        client.playlist.listAction(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaPlayListResponse', {result: results.objects})
          }
        }
        //,filter,pager
      );
    });

    router.route('/media/network/:network/:categoryId?').get( function(req, res) {

        var network = req.params.network || null;

        // hit http://localhost:3999/node/kaltura-service/api/v1/metadata/list
        // by name: "AZ Spot Schema", ==> App Name with Schema Appended
        // to get 6389811;
        // name is currently undecided so pass catId or use default of AZ Spot Schema
        var categoryId;
        if (req.params.categoryId){
            categoryId = req.params.categoryId;
        } else {
            categoryId = 6389811;
        }
        var filter = new vo.KalturaMediaEntryFilter();
        var filterAdvancedSearch = new vo.KalturaMetadataSearchItem();
        filterAdvancedSearch.metadataProfileId = categoryId;
        // filterAdvancedSearch.metadataProfileId = 6389811;
        filterAdvancedSearch.type = kalturaTypes.KalturaSearchOperatorType.SEARCH_OR;
        filterAdvancedSearch.objectType = 'KalturaMetadataSearchItem';
        var filterAdvancedSearchItem = new vo.KalturaSearchCondition();
        filterAdvancedSearchItem.field = "/*[local-name()='metadata']/*[local-name()='Networks']";
        filterAdvancedSearchItem.value = network; // assign value here
        filterAdvancedSearchItem.objectType = 'KalturaSearchCondition';

        /*
        // in case a second field is needed
        var filterAdvancedSearchItem2 = new vo.KalturaSearchCondition();
        filterAdvancedSearchItem2.field = "/*[local-name()='metadata']/*[local-name()='Test2']";
        filterAdvancedSearchItem2.value = 'your search value'; // assign value
        filterAdvancedSearchItem2.objectType = 'KalturaSearchCondition';
        filterAdvancedSearch.items = [filterAdvancedSearchItem, filterAdvancedSearchItem2];
        */

        filterAdvancedSearch.items = [filterAdvancedSearchItem];
        filter.advancedSearch = filterAdvancedSearch;
        // add the order by parameter (optional)
        // filter.orderBy = '-recent';

        var pager = null;

        client.media.listAction(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaMediaListResponseByNetwork', {result: results})
          }
        }
        ,filter,pager
      );
    });

    router.route('/media/filter/network/:networkName').get( function(req, res) {

        // hit http://localhost:3999/node/kaltura-service/api/v1/category/list
        // by name: "Affiliate Spot Delivery", ==> App Name
        // to get 37458261;
        // name is currently undecided so pass categoryID or use default of Affiliate Spot Delivery
        var categoriesId = 37458261;

        // hit http://localhost:3999/node/kaltura-service/api/v1/metadata/list
        // by name: "AZ Spot Schema", ==> App Name with Schema Appended
        // to get 6389811;
        // name is currently undecided so pass networkID or use default of AZ Spot Schema
        var metadataProfileId = 6389811;

        var networkName = req.params.networkName || null;

        var filter = new vo.KalturaMediaEntryFilter();
        filter.categoriesIdsMatchAnd = categoriesId;
        
        var filterAdvancedSearch = new vo.KalturaMetadataSearchItem();
        filterAdvancedSearch.objectType = 'KalturaMetadataSearchItem';
        filterAdvancedSearch.type = kalturaTypes.KalturaSearchOperatorType.SEARCH_OR;
        filterAdvancedSearch.metadataProfileId = metadataProfileId;
        var filterAdvancedSearchItem = new vo.KalturaSearchCondition();
        filterAdvancedSearchItem.objectType = 'KalturaSearchCondition';
        filterAdvancedSearchItem.field = "/*[local-name()='metadata']/*[local-name()='Networks']";
        filterAdvancedSearchItem.value = networkName; // assign value here

        filterAdvancedSearch.items = [filterAdvancedSearchItem];
        filter.advancedSearch = filterAdvancedSearch;
        // add the order by parameter (optional)
        // filter.orderBy = '-recent';

        var pager = null;

        client.media.listAction(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaMediaListResponseByNetwork', {result: results})
          }
        }
        ,filter,pager
      );
    });

    router.route('/playlist/network/:network').get( function(req, res) {

        var network = req.params.network || null;
        var id = "1_ac7vzv8x";
        var filter = new vo.KalturaMediaEntryFilterForPlaylist();
        var filterAdvancedSearch = new vo.KalturaMetadataSearchItem();
        filterAdvancedSearch.metadataProfileId = 6389811;
        filterAdvancedSearch.type = kalturaTypes.KalturaSearchOperatorType.SEARCH_OR;
        filterAdvancedSearch.objectType = 'KalturaMetadataSearchItem';
        var filterAdvancedSearchItem = new vo.KalturaSearchCondition();
        filterAdvancedSearchItem.field = "/*[local-name()='metadata']/*[local-name()='Networks']";
        filterAdvancedSearchItem.value = network; // assign value here
        filterAdvancedSearchItem.objectType = 'KalturaSearchCondition';
        filterAdvancedSearch.items = [filterAdvancedSearchItem];
        filter.advancedSearch = filterAdvancedSearch;

        var pager = null;

        client.playlist.execute(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaPlaylistResponseByNetwork', {result: results})
          }
        }
        ,id,filter,pager
      );
    });


    router.route('/metadata').get( function(req, res) {

        var id = "6389811";
        var filter = "";
        var pager = null;

        client.metadataProfile.listFields(function(results) {
          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaMetaDataResponse', {result: results})
          }
        }
        ,id,filter,pager
      );
    });

    router.route('/metadata/list').get( function(req, res) {

        // var id = "6389811";
        var filter = null;
        var pager = null;

        client.metadataProfile.listAction(function(results) {
            var xmlObj = results.objects[1].xsd;
            //console.log(xmlObj);

            var parseString = xml2js.parseString;
            parseString(xmlObj, function (err, result) {
                console.log(JSON.stringify(result));
            });

          if (results && results.code && results.message) {
            console.log('Kaltura Error', results);
            // res.json(results.message);
            res.type('application/json');
            res.status(500).jsonp(results.message);
          } else {
            res.type('application/json');
            // res.json('KalturaMediaListResponse', {request: req.body, result: results.objects})
            res.status(500).jsonp('KalturaMetaDataListResponse', {result: results})
          }
        }
        ,filter,pager
      );
    });

    app.use('/node/kaltura-service/api/v1', router);

    var server = app.listen(config.app_port, function () {
      var host = server.address().address;
      console.error(chalk.black.bgWhite('Application started on port ' + config.app_port));
    });

    return app;
};
