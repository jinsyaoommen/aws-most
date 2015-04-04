'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects/unfoldObjects', function() {
  it(
    'should call s3.listObjectsPromised and pass a long to data handler',
    function() {
      var proceessorFn = 'test.processorFn';
      var params = 'test.params';
      var responseHandlerFn = 'test.responseHandlerFn';
      var s3;
      var responseHandler;
      var unfoldObjects;
      var result;

      s3 = {
        listObjectsPromised: sinon.stub().returnsThis(),
        then: sinon.stub()
      };

      responseHandler = sinon.stub().returns(responseHandlerFn);
      unfoldObjects = proxyquire('../../../s3/listObjects/unfoldObjects', {
        './responseHandler': responseHandler
      });

      s3.then.returns('test.promise');

      result = unfoldObjects(s3, proceessorFn, params);

      s3.listObjectsPromised.calledOnce.should.equal(true);
      s3.listObjectsPromised.args[0].should.have.length(1);
      s3.listObjectsPromised.args[0][0].should.equal(params);

      responseHandler.calledOnce.should.equal(true);
      responseHandler.args[0].should.have.length(2);
      responseHandler.args[0][0].should.equal(proceessorFn);
      responseHandler.args[0][1].should.equal(params);

      s3.then.calledOnce.should.equal(true);
      s3.then.args[0].should.have.length(1);
      s3.then.args[0][0].should.equal(responseHandlerFn);

      result.should.eql('test.promise');
    }
  );
});
