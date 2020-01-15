const { parseInput, PARSER } = require("./ULA_parser");


/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = "CREA a; a = 4;";


let message = parseInput(code);

console.log(message);