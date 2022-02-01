"use strict";

function doSomething() {
  return 'hello';
}

function MyClass() {
}
MyClass.prototype = {
  myProp: '1',
  doSomethingInClass() {
    return 'world';
  }
}
