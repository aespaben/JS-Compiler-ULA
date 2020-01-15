const { parseInput, PARSER } = require("./ULA_parser");


/* Modifíca la cadena para que pertenezca al lenguaje. */
let code = "CREA a; MUESTRA(a); MUESTRA(5 / 2);";


let message = parseInput(code);

console.log(message);