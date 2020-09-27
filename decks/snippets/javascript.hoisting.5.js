// throws ReferenceError: Cannot access 'func' 
// before initialization
"use strict";
(function () {
  alert(typeof func);

  let func = function () {
  }

  alert(typeof func); // prints 'function'
})()
