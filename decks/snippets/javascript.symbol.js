let Sym1 = Symbol("Sym")
let Sym2 = Symbol("Sym")
  
console.log(Sym1 === Sym2) // returns "false"

const obj = {
  [Sym1] : 'value', // can only be access with the symbol
  [Sym2] : 'value2'
}

obj[Sym1] // access the value of the property Sym1
