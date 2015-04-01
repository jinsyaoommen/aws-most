'use strict';

var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects/responseHandler', function() {
  var params = { foo: 'bar' };
  var processorFnPromise;
  var processorFn;
  var handleResponse;

  beforeEach(function() {
    var responseHandler = require('../../../s3/listObjects/responseHandler');
    processorFnPromise = { then: sinon.stub() };
    processorFn = sinon.stub().returns(processorFnPromise);

    handleResponse = responseHandler(processorFn, params);
  });

  it(
    'should  execute the processorFn handle build a tuple from its response',
    function() {
      var data = { Contents: [] };
      var result;

      processorFnPromise.then.returns('test.promise');

      result = handleResponse(data);

      processorFn.calledOnce.should.equal(true);
      processorFn.args[0].should.have.length(1);
      processorFn.args[0][0].should.equal(data.Contents);

      result.should.equal('test.promise');
    }
  );

  it(
    'should return tuple.done as true if data.Contents has zero length',
    function() {
      var data = { Contents: [] };
      var buildNextTuple;
      var result;

      handleResponse(data);

      processorFnPromise.then.calledOnce.should.equal(true);
      processorFnPromise.then.args[0].should.have.length(1);
      processorFnPromise.then.args[0][0].should.be.type('function');

      buildNextTuple = processorFnPromise.then.args[0][0];
      result = buildNextTuple('foo');
      result.should.eql({ value: 'foo', seed: params, done: true });
    }
  );

  it(
    'should set params.Marker to last Key, and tuple.done to false' +
    'if data.Contents has length',
    function() {
      var data = {
        Contents: [
          { Key: 'alpha' },
          { Key: 'bravo' }
        ]
      };
      var buildNextTuple;
      var result;

      handleResponse(data);

      processorFnPromise.then.calledOnce.should.equal(true);
      processorFnPromise.then.args[0].should.have.length(1);
      processorFnPromise.then.args[0][0].should.be.type('function');

      buildNextTuple = processorFnPromise.then.args[0][0];
      result = buildNextTuple('foo');
      result.should.eql({
        value: 'foo',
        seed: { foo: 'bar', Marker: 'bravo' },
        done: false
      });
    }
  );
});
