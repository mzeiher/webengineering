"use strict";
(function () {
  alert(typeof func); // prints 'undefined'

  var func = function () {
  }

  alert(typeof func); // prints 'function'
})()
