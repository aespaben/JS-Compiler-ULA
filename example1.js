const { parseInput} = require("./ULA_parser");
const { toAst } = require("./ULA_CST");
/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = `
a = 1+1+1*2/3;
MUESTRA(a);
`;


// parseInput(code);
console.log(JSON.stringify(toAst(code), null, 2));
