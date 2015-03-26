'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3', function() {
  var s3Promised = 'test.s3.promised';
  var listObjects = 'test.listObjects';
  var awsPromised;
  var wrap;
  var createS3Most;

  beforeEach(function() {
    awsPromised = { getS3: sinon.stub().returns(s3Promised) };
    wrap = sinon.stub();

    createS3Most = proxyquire('../../s3', {
      'aws-promised': awsPromised,
      'lodash/function/wrap': wrap,
      './listObjects': listObjects
    });
  });

  describe('createS3Most', function() {
    var options = 'test.options';

    it('should create s3 promised client', function () {
      createS3Most(options);
      awsPromised.getS3.calledOnce.should.equal(true);
      awsPromised.getS3.args[0].should.have.length(1);
      awsPromised.getS3.args[0][0].should.equal(options);
    });

    it('should create listObject method injected with s3 client', function () {
      var wrappedListObjects = 'test.wrapped.listObjects';
      var s3Most;

      wrap.onCall(0).returns(wrappedListObjects);

      s3Most = createS3Most(options);

      wrap.args[0].should.have.length(2);
      wrap.args[0][0].should.equal(s3Promised);
      wrap.args[0][1].should.equal(listObjects);
      s3Most.listObjects.should.equal(wrappedListObjects);
    });
  });
});
