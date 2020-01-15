const { parseInput, PARSER } = require("./ULA_parser");

let message = parseInput("CREA a; a = 4; SI(a) ENTONCES b;");

console.log(message);