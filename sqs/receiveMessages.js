'use strict';

var most = require('most');

/**
 * Returns a most stream of SQS messages received from an SQS
 * receiveMessage sdk call. Note the incoming sqs client needs
 * to be one which provides a Promises/A+ compliant interface to SQS.
 *
 * @param sqs AWS promised sqs client.
 * @param {object} params Params object suitable for SQS.receiveMessage call.
 * @returns {*|Stream}
 */
function receiveMessages(sqs, params) {
  function dataToMessages(data) {
    return most.from(data.Messages || []);
  }

  // Flat maps the array of messages returned to a most stream.
  return most
    .fromPromise(sqs.receiveMessage(params))
    .flatMap(dataToMessages);
}

module.exports = receiveMessages;
