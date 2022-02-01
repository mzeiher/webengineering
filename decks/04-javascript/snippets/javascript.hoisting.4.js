"use strict";
(function () {
  var func;
  alert(typeof func); // prints 'undefined'

  func = function () {
  }

  alert(typeof func); // prints 'function'
})()
