'use strict';

var _ = require('lodash');
var Yelp = require('./yelp.model');
var cheerio = require('cheerio');
var async = require('async');
var request = require('request')
var selp = require("yelp").createClient({
  consumer_key: "2jeoJ5NnpuKb5_c4-FZ1zg", 
  consumer_secret: "P9UZhcrwvDh_Z1SnUQ0SNm4rYHk",
  token: "1CRKUxRxleEOaWHcaiAzu5NcL5i5TA8z",
  token_secret: "cH4EY9nMB1oO4kmxQmZh_7L73hQ", 
  ssl: true
});


exports.yelpi = function(req, res){
  console.log(req.body)
  var offset = req.body.offset
  var deal = req.body.deal
  var lon = req.body.coords.longitude.toString()
  var lat = req.body.coords.latitude.toString()
  var search = req.body.search

selp.search({term: search, ll: lat + ', ' + lon, sort: 0,  limit: 11, offset: offset, deals_filter: deal }, function(error, data) {

  exports.getCheerio(data, res)
 
});
}

exports.getCheerio = function(req, res) {
    var cheerioStuff = function(item, cb) {
        var url = item.url
        request.get({
            url: url
        }, function(err, response) {
            if(err){
              console.log(err)
            }
                else{
                var htmlFromYelp = response.body;
                var $ = cheerio.load(htmlFromYelp);
                item.price = $('.price-range').text()
                item.priceRange = $(".price-description").text()
                item.hours = $(".hour-range").text()
                item.dircs = $()
                console.log(item.deal)
                cb(err, item)

            }
        })
    }
    async.map(req.businesses, cheerioStuff, function(err, results) { 
       res.json(results)
    })
}


// Get list of yelps
exports.index = function(req, res) {
  Yelp.find(function (err, yelps) {
    if(err) { return handleError(res, err); }
    return res.json(200, yelps);
  });
};

// Get a single yelp
exports.show = function(req, res) {
  Yelp.findById(req.params.id, function (err, yelp) {
    if(err) { return handleError(res, err); }
    if(!yelp) { return res.send(404); }
    return res.json(yelp);
  });
};

// Creates a new yelp in the DB.
exports.create = function(req, res) {
  Yelp.create(req.body, function(err, yelp) {
    if(err) { return handleError(res, err); }
    return res.json(201, yelp);
  });
};

// Updates an existing yelp in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Yelp.findById(req.params.id, function (err, yelp) {
    if (err) { return handleError(res, err); }
    if(!yelp) { return res.send(404); }
    var updated = _.merge(yelp, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, yelp);
    });
  });
};

// Deletes a yelp from the DB.
exports.destroy = function(req, res) {
  Yelp.findById(req.params.id, function (err, yelp) {
    if(err) { return handleError(res, err); }
    if(!yelp) { return res.send(404); }
    yelp.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}