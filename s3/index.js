'use strict';

var awsPromised = require('aws-promised');
var partial = require('lodash/function/partial');
var listObjects = require('./listObjects');

/**
 * Returns an s3 most client.
 *
 * @param options
 * @returns {{listObjects: (Function|*|exports)}}
 */
function createS3Most(options) {
  var s3 = awsPromised.getS3(options);

  return {
    listObjects: partial(listObjects, s3)
  };
}

module.exports = createS3Most;
