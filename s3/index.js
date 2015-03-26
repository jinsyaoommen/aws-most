'use strict';

var awsPromised = require('aws-promised');
var wrap = require('lodash/function/wrap');
var listObjects = require('./listObjects');

function createS3Most(options) {
  var s3 = awsPromised.getS3(options);

  return {
    listObjects: wrap(s3, listObjects)
  };
}

module.exports = createS3Most;
