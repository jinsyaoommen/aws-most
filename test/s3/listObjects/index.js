'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects', function() {
  it(
    'should unfold a most stream of objects returned from the unfolder',
    function() {
      var listObjectsStream = 'test.stream';
      var unfoldObjects = 'test.unfoldObjects';
      var unfolder = 'test.partial.unfoldObjects';
      var s3 = 'test.s3';
      var params = 'test.params';
      var processorFn = 'test.processorFn';

      var most = {
        unfold: sinon.stub().returns(listObjectsStream)
      };
      var partial = sinon.stub().returns(unfolder);

      var listObjects = proxyquire('../../../s3/listObjects', {
        most: most,
        'lodash/function/partial': partial,
        './unfoldObjects': unfoldObjects
      });

      var result = listObjects(s3, params, processorFn);

      partial.calledOnce.should.equal(true);
      partial.args[0].should.have.length(3);
      partial.args[0][0].should.equal(unfoldObjects);
      partial.args[0][1].should.equal(s3);
      partial.args[0][2].should.equal(processorFn);

      most.unfold.calledOnce.should.equal(true);
      most.unfold.args[0].should.have.length(2);
      most.unfold.args[0][0].should.equal(unfolder);
      most.unfold.args[0][1].should.equal(params);

      result.should.equal(listObjectsStream);
    }
  );
});
