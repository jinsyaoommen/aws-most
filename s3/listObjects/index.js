'use strict';

var most = require('most');
var partial = require('lodash/function/partial');
var unfoldObjects = require('./unfoldObjects');

/**
 * Returns a most stream unfolded from a sequence of data responses from
 * AWS.S3.listObjects. The resolution of the processorFn promise determines
 * the value which emits from this stream.
 *
 * @param {object} s3 S3 promised client from aws-promised
 * @param {object} params Params object suitable for S3.listObjects call.
 * @param {function} processorFn Works with the collection of s3 objects.
 *
 * @returns {*|Stream}
 */
function listObjects(s3, params, processorFn) {
  var unfolder = partial(unfoldObjects, s3, processorFn);
  return most.unfold(unfolder, params);
}

module.exports = listObjects;
