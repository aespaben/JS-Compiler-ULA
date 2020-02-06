const { parseInput} = require("./ULA_parser");
const { toAst } = require("./ULA_CST");
/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = `
CREA a;
a = 1+2+3+4*5/9;
MUESTRA(a);
`;


// parseInput(code);
console.log(JSON.stringify(toAst(code), null, 2));