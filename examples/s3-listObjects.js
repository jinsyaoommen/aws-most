'use strict';

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

s3.listObjects(params)
  .filter(byKeyPattern)
  .observe(logFileName)
  .then(done);

function byKeyPattern(file) {
  return /^foo/.test(file.Key);
}

function logFileName(file) {
  console.log(file.Key);
}

function done() {
  console.log('All done! No more files');
}

// Here's the final output

// someFolder/foo-1.txt
// someFolder/foo-2.txt
// All done! No more files
