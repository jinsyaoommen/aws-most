'use strict';

var responseHandler = require('./responseHandler');

/**
 * Delegates to the responseHandler module to process the response data from
 * AWS.S3.listObject. The responseHandler responds returns a tuple for the next
 * iteration of the unfold function.
 *
 * It keeps seeding the next call of this function with a params object that
 * has the Marker field set to the last Key in the received set. This keeps
 * making paginated calls to s3 for the next 1000 objects, as soon as the
 * responseHandler is done processing it's current list of 1000 objects.
 *
 * @param s3 A promisified s3 client.
 * @param processorFn Processes the collection of s3 objects.
 * @param {object} params Parameters to pass to AWS.S3.listObjects
 *
 * @returns {*|Promise}
 */
function unfoldObjects(s3, processorFn, params) {
  return s3
    .listObjectsPromised(params)
    .then(responseHandler(processorFn, params));
}

module.exports = unfoldObjects;
