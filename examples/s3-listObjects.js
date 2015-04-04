'use strict';

var most = require('most');
var noop = require('lodash/utility/noop');
var awsMost = require('../');
var s3 = awsMost.s3();

// Imagine you have this bucket with a folder in it.
//
// my-bucket/
//  someFolder/
//    foo-1.txt
//    foo-2.txt
//    bar-1.txt
//    bar-2.txt

// Then imagine it's not this simple, but instead has 1,000,000 files in it!!
// Half of them are foo's and half are bar's.
// Now let's imagine we only want to do something with the foo's.
// Here it is.

var params = {
  Bucket: 'my-bucket',
  Prefix: 'someFolder/'
};

// The aws-most s3.listObjects stream.
s3.listObjects(params, logFooFiles)
  .observe(noop)
  .then(done);

// This is the processorFn argument aws-mosts' s3.listObjects. It receives a collection
// of s3 objects unfolded from a single call to AWS.S3.listObjects. The
// processor function must return a promise after it has completed. The
// resolution of the promise then triggers aws-mosts' s3.listObjects to unfold
// another collection of s3Objects from the bucket.
//
// In this example I'm using a most stream, to process the collection of
// s3Objects. The .observe method returns a promise which resolves when, in this
// case, all files have been filtered by name and logged to the console.
function logFooFiles(s3Objects) {
  return most
    .from(s3Objects)
    .filter(byKeyPattern)
    .observe(logFileName);
}

function byKeyPattern(s3Object) {
  return /^foo/.test(s3Object.Key);
}

function logFileName(s3Object) {
  console.log(s3Object.Key);
}

function done() {
  console.log('All done! No more files');
}

// Here's the final output

// someFolder/foo-1.txt
// someFolder/foo-2.txt
// All done! No more files
