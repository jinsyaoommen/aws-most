'use strict';

function responseHandler(processorFn, params) {
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
