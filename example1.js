const { parseInput, PARSER } = require("./ULA_parser");

/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = `
CREA a = a + 5;

a = b;

SI(a ES b) ENTONCES {
  b = a
}
`;


parseInput(code);