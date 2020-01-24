const { parseInput} = require("./ULA_parser");
const { toAst } = require("./ULA_CST");
/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = `
LEE(x);
`;


// parseInput(code);
console.log(JSON.stringify(toAst(code), null, 2));