'use strict';

var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects/unfoldObjects', function() {
  var s3;
  var unfoldObjects;

  beforeEach(function() {
    s3 = {
      listObjectsPromised: sinon.stub().returnsThis(),
      then: sinon.stub()
    };

    unfoldObjects = require('../../../s3/listObjects/unfoldObjects');
  });

  it(
    'should call s3.listObjectsPromised and build a "tuple" of listObjects data',
    function() {
      var params = 'test.params';

      s3.then.returns('test.tuple');

      var result = unfoldObjects(s3, params);

      s3.listObjectsPromised.calledOnce.should.equal(true);
      s3.listObjectsPromised.args[0].should.have.length(1);
      s3.listObjectsPromised.args[0][0].should.equal(params);

      s3.then.calledOnce.should.equal(true);

      result.should.eql('test.tuple');
    }
  );

  describe('buildNextTuple', function() {
    var params;
    var buildNextTuple;

    beforeEach(function() {
      params = {};
      unfoldObjects(s3, params);

      s3.then.args[0].should.have.length(1);
      buildNextTuple = s3.then.args[0][0];
      buildNextTuple.should.be.type('function');
    });

    it(
      'it should set params.Marker with Key of last object in data.Contents ' +
      'to pass as the seed to the next unfold iteration',
      function() {
        var data = {
          Contents: [
            {
              Key: 'test.key'
            },
            {
              Key: 'last.key'
            }
          ]
        };

        var expectedTuple = {
          value: data.Contents,
          seed: { Marker: 'last.key' },
          done: false
        };

        var result = buildNextTuple(data);

        result.should.eql(expectedTuple);
      }
    );

    it(
      'it should not set the Marker and trigger the end of unfolding if ' +
      'there are no objects in the data.Contents list',
      function() {
        var data = { Contents: [] };
        var expectedTuple = { value: [], seed: {}, done: true };
        var result = buildNextTuple(data);
        result.should.eql(expectedTuple);
      }
    );
  });
});
