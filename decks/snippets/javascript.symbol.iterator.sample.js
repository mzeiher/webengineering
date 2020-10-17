const NumberGenerator = {
  [Symbol.iterator]() {
    return { next: () => {
        return { value: this.counter++, done: false};
      }
    }
  },
  counter: 0
}

for(const nbr of NumberGenerator) {
  console.log(nbr);
  if(nbr > 100) break;
}
