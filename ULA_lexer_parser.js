const { Lexer, createToken: ct, CstParser } = require("chevrotain");

var TOKENS = [];

const createToken = (name, pattern, longer_alt = "", skiped = false) => {
  let props = {
    name,
    pattern
  };

  if(longer_alt !== "") {
    props.longer_alt = longer_alt;
  }

  if(skiped) {
    props.group = Lexer.SKIPPED;
  }

  let token = ct(props);
  TOKENS.unshift(token);
  return token;
};

/* IDENTIFICADOR.
***********************************************/

const IDENTIFICADOR = createToken("IDENTIFICADOR", /[a-z][a-z0-9]*/i);

/* PALABRAS RESERVADAS. 
***********************************************/

const SI = createToken("SI", /SI/, IDENTIFICADOR);

const SINO = createToken("SINO", /SINO/, IDENTIFICADOR);

const ENTONCES = createToken("ENTONCES", /ENTONCES/, IDENTIFICADOR);

const REPITE = createToken("REPITE", /REPITE/, IDENTIFICADOR);

const VECES = createToken("VECES", /VECES/,IDENTIFICADOR);

const MUESTRA = createToken("MUESTRA", /MUESTRA/, IDENTIFICADOR);

const CREA = createToken("CREA", /CREA/, IDENTIFICADOR);

const CIERTO = createToken("CIERTO", /CIERTO/, IDENTIFICADOR);

const FALSO = createToken("FALSO", /FALSO/, IDENTIFICADOR);

const Y = createToken("Y", /Y/, IDENTIFICADOR);

const O = createToken("O", /O/, IDENTIFICADOR);

const NO = createToken("NO", /NO/, IDENTIFICADOR);

/* PARÉNTESIS, CORCHETES Y LLAVES.
***********************************************/

const PAREN_I = createToken("PAREN_I", /\(/);

const PAREN_D = createToken("PAREN_D", /\)/);

const CORCH_I = createToken("CORCH_I", /\[/);

const CORCH_D = createToken("CORCH_D", /]/);

const LLAVE_I = createToken("LLAVE_I", /\{/);

const LLAVE_D = createToken("LLAVE_D", /}/);

/* PUNTO Y COMA, COMA, ORACIÓN.
***********************************************/

const PUNTO_COMA = createToken("PUNTO_COMA", /;/);

const COMA = createToken("COMA", /,/);

const FRASE = createToken("FRASE", /"([^"]|\\")*"/);

/* NÚMERO.
***********************************************/

const NUMERO = createToken("NUMERO", /0|([1-9][0-9]*)/);

/* OPERADORES LÓGICOS.
***********************************************/

const MENOR = createToken("MENOR", /</);

const MAYOR = createToken("MAYOR", />/);

const MENOR_IGUAL = createToken("MENOR_IGUAL", /<=/);

const MAYOR_IGUAL = createToken("MAYOR_IGUAL", />=/);

const IGUAL = createToken("IGUAL", /ES/, IDENTIFICADOR);

/* OPERADORES ARITMÉTICOS.
***********************************************/

const MAS = createToken("MAS", /\+/);

const MENOS = createToken("MENOS", /\-/);

const POR = createToken("POR", /\*/);

const ENTRE = createToken("ENTRE", /\//);

const ASIGNACION = createToken("ASIGNACION", /=/);

/* ESPACIOS EN BLANCO.
***********************************************/

const ESPACIOS = createToken("ESPACIOS",/[\s\t\n]+/, "" , true);

/* LEXER.
***********************************************/

const LEXER = new Lexer(TOKENS);

const tokenize = (inputText) => {
  const lexingResult = LEXER.tokenize(inputText);
  return lexingResult;
}

module.exports.tokenize = tokenize;

/* PARSER.
***********************************************/

class ULAParser extends CstParser {
  constructor() {
    super(TOKENS);
    const $ = this;

    /* REGLA: Declarar y definir variable. */

    $.RULE("declararVariable", () => {
      $.SUBRULE($.keywordCrea);
      $.SUBRULE($.nombreVariable);
      $.SUBRULE($.puntoYComa);
    });

    $.RULE("keywordCrea", () => {
      $.CONSUME(CREA);
    });

    $.RULE("nombreVariable", () => {
      $.CONSUME(IDENTIFICADOR);
    });

    $.RULE("puntoYComa", () => {
      $.CONSUME(PUNTO_COMA);
    });

    this.performSelfAnalysis();
  }
};

const parser = new ULAParser();
module.exports.parser = parser;

const parseInput = (inputText) => {
  parser.input = tokenize(inputText).tokens;
  
  let message = parser.declararVariable();

  return message !== undefined ? message : parser.errors;
};

module.exports.parseInput = parseInput;