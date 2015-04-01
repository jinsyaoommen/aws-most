'use strict';

/**
 * Partials the processorFn, and the params hash for use by the returned
 * handleResponse function.
 *
 * @param {function} processorFn Processes the collection of s3 objects.
 * @param {object} params AWS.S3.listObjects params hash.
 *
 * @returns {Function}
 */
function responseHandler(processorFn, params) {
  /**
   * This function is responsible for calling the processorFn with a collection
   * of s3Objects and returning a most.unfold suitable tuple to determine
   * whether more data should be requested from s3.
   *
   * If there are s3Objects in the data.Contents property, they are processed.
   * If the processorFn promise is resolved with a value, it is the value which
   * will be emitted from the aws-most s3.listObjects stream.
   *
   * @param {object} data A response from AWS.S3.listObjects
   *
   * @returns {Promise}
   */
  return function handleResponse(data) {
    var s3Objects = data.Contents;
    var lastFileIndex = s3Objects.length - 1;
    var done = s3Objects.length === 0;

    if (!done) {
      params.Marker = s3Objects[lastFileIndex].Key;
    }

    function buildNextTuple(value) {
      return { value: value, seed: params, done: done };
    }

    return processorFn(s3Objects).then(buildNextTuple);
  };
}

module.exports = responseHandler;
