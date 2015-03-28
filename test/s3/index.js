'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3', function() {
  var s3Promised = 'test.s3.promised';
  var listObjects = 'test.listObjects';
  var awsPromised;
  var partial;
  var createS3Most;

  beforeEach(function() {
    awsPromised = { getS3: sinon.stub().returns(s3Promised) };
    partial = sinon.stub();

    createS3Most = proxyquire('../../s3', {
      'aws-promised': awsPromised,
      'lodash/function/partial': partial,
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
      var partialedListObjects = 'test.partialed.listObjects';
      var s3Most;

      partial.onCall(0).returns(partialedListObjects);

      s3Most = createS3Most(options);

      partial.args[0].should.have.length(2);
      partial.args[0][0].should.equal(listObjects);
      partial.args[0][1].should.equal(s3Promised);
      s3Most.listObjects.should.equal(partialedListObjects);
    });
  });
});
