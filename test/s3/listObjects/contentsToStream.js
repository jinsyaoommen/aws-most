'use strict';

var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('s3/listObjects/contentsToStream', function() {
  it('should create most stream from contents array', function() {
    var modulePath = '../../../s3/listObjects/contentsToStream';
    var most = { from: sinon.stub() };
    var contentsToStream = proxyquire(modulePath, { most: most });
    var contents = [ 'file1', 'file2' ];
    var result;

    most.from.returns('test.stream');

    result = contentsToStream(contents);

    most.from.calledOnce.should.equal(true);
    most.from.args[0].should.have.length(1);
    most.from.args[0][0].should.equal(contents);

    result.should.eql('test.stream');
  });
});
