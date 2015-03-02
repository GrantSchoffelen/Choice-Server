/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Yelp = require('./yelp.model');

exports.register = function(socket) {
  Yelp.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Yelp.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('yelp:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('yelp:remove', doc);
}