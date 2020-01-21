const { parseInput, PARSER } = require("./ULA_parser");

/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = `
CREA a = a + 5;

a = b;

SI(a ES b) ENTONCES {
  b = a;
}
`;


let message = parseInput(code);

console.log(message.children.Decision[0].children);