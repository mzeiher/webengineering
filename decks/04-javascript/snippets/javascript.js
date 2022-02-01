import { util } from './utils.js';
import { renderer } from 'rendererlib';

function doSomething() {
  return 'hello';
}

class MyClass {
  constructor() {
    this.myProp = '1'
  }

  doSomethingInClass() {
    return 'world'
  }
}

export { doSomething, MyClass };
