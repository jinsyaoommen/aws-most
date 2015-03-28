'use strict';

/**
 * This is an iterator function for a call to most.unfold. It makes an async
 * call to s3.listObjects, and returns a promise. That promise is fullfilled
 * by a tuple object to pass to the next iteration of unfold.
 *
 * It keeps seeding the next call of this function with a params object that
 * has the Marker field set to the last Key in the received set. Basically this
 * is a way to keep making paginated calls to listObjects because it at most
 * returns 1000 objects in it's response.
 *
 * @param s3 A promisified s3 client.
 * @param {object} params Parameters to pass to AWS.S3.listObjects
 *
 * @returns {*|Promise}
 */
function unfoldObjects(s3, params) {
  function buildNextTuple(data) {
    var lastFileIndex = data.Contents.length - 1;
    var done = data.Contents.length === 0;

    if (!done) {
      params.Marker = data.Contents[lastFileIndex].Key;
    }

    return {value: data.Contents, seed: params, done: done};
  }

  return s3
    .listObjectsPromised(params)
    .then(buildNextTuple);
}

module.exports = unfoldObjects;
