'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects', function() {
  it(
    'should unfold a most stream of file data objects returned by s3',
    function() {
      var listObjectsStream = 'test.stream';
      var unfoldObjects = 'test.unfoldObjects';
      var unfolder = 'test.wrap.unfoldObjects';
      var contentsToStream = 'test.contentsToStream';
      var s3 = 'test.s3';
      var params = 'test.params';

      var most = {
        unfold: sinon.stub().returnsThis(),
        flatMap: sinon.stub().returns(listObjectsStream)
      };
      var wrap = sinon.stub().returns(unfolder);

      var listObjects = proxyquire('../../../s3/listObjects', {
        most: most,
        'lodash/function/wrap': wrap,
        './unfoldObjects': unfoldObjects,
        './contentsToStream': contentsToStream
      });

      var result = listObjects(s3, params);

      wrap.calledOnce.should.equal(true);
      wrap.args[0].should.have.length(2);
      wrap.args[0][0].should.equal(s3);
      wrap.args[0][1].should.equal(unfoldObjects);

      most.unfold.calledOnce.should.equal(true);
      most.unfold.args[0].should.have.length(2);
      most.unfold.args[0][0].should.equal(unfolder);
      most.unfold.args[0][1].should.equal(params);

      most.flatMap.calledOnce.should.equal(true);
      most.flatMap.args[0].should.have.length(1);
      most.flatMap.args[0][0].should.equal(contentsToStream);

      result.should.equal(listObjectsStream);
    }
  );
});
