'use strict';

var most = require('most');
var wrap = require('lodash/function/wrap');
var unfoldObjects = require('./unfoldObjects');
var contentsToStream = require('./contentsToStream');

/**
 * Returns a most stream of S3 file data object.
 *
 * See the Contents property of the return of AWS.S3.listObjects
 * @link http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 *
 * @param {object} s3 S3 promised client from aws-promised
 * @param {object} params Params object suitable for S3.listObjects call.
 * @returns {*|Stream}
 */
function listObjects(s3, params) {
  var unfolder = wrap(s3, unfoldObjects);
  return most.unfold(unfolder, params).flatMap(contentsToStream);
}

module.exports = listObjects;
