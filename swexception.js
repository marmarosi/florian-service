"use strict";

function SwException(message) {
  this.message = message;
  this.name = 'SwException';
}

SwException.prototype.toString = function() {
  return this.name + ': "' + this.message + '"';
};

module.exports = SwException;
