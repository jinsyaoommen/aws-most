'use strict';

var most = require('most');

/**
 * Converts a collection of file objects into a most stream.
 *
 * @param contents A collection of file objects
 * @returns {Stream} A most stream.
 */
function contentsToStream(contents) {
  return most.from(contents);
}

module.exports = contentsToStream;
