const numbers = [];
for(let i = 0; i < 1000000; i++) {
  numbers.push(Math.round(Math.random() * 2)+1);
}
const filter = (value) => value % 2 === 0;
const map = (value) => value*value;
const reduce = (acc, value) => acc + value;

//
numbers.filter(filter).map(map).reduce(reduce,0)

//
let acc = 0;
for(let num of numbers) {
  if(filter(num)) {
    acc = reduce(acc, map(num));
  }
}
