/* LEXER.
***********************************************/
const { Lexer, createToken } = require("chevrotain");

let TOKENS = [];

/* IDENTIFICADOR.
***********************************************/

const IDENTIFICADOR = createToken({ name: "IDENTIFICADOR", pattern: /[a-z][a-z0-9]*/i });

TOKENS.unshift(IDENTIFICADOR);

/* PALABRAS RESERVADAS. 
***********************************************/

const SI = createToken({ name: "SI", pattern: /SI/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(SI);

const SINO = createToken({ name: "SINO", pattern: /SINO/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(SINO);

const ENTONCES = createToken({ name: "ENTONCES", pattern: /ENTONCES/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(ENTONCES);

const REPITE = createToken({ name: "REPITE", pattern: /REPITE/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(REPITE);

const VECES = createToken({ name: "VECES", pattern: /VECES/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(VECES);

const MUESTRA = createToken({ name: "MUESTRA", pattern: /MUESTRA/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(MUESTRA);

const LEE = createToken({ name: "LEE", pattern: /LEE/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(LEE);

const CREA = createToken({ name: "CREA", pattern: /CREA/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(CREA);

const CIERTO = createToken({ name: "CIERTO", pattern: /CIERTO/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(CIERTO);

const FALSO = createToken({ name: "FALSO", pattern: /FALSO/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(FALSO);

const Y = createToken({ name: "Y", pattern: /Y/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(Y);

const O = createToken({ name: "O", pattern: /O/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(O);

const NO = createToken({ name: "NO", pattern: /NO/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(NO);

/* PARÉNTESIS, CORCHETES Y LLAVES.
***********************************************/

const PAREN_I = createToken({ name: "PAREN_I", pattern: /\(/ });
TOKENS.unshift(PAREN_I);

const PAREN_D = createToken({ name: "PAREN_D", pattern: /\)/ });
TOKENS.unshift(PAREN_D);

const CORCH_I = createToken({ name: "CORCH_I", pattern: /\[/ });
TOKENS.unshift(CORCH_I);

const CORCH_D = createToken({ name: "CORCH_D", pattern: /\]/ });
TOKENS.unshift(CORCH_D);

const LLAVE_I = createToken({ name: "LLAVE_I", pattern: /\{/ });
TOKENS.unshift(LLAVE_I);

const LLAVE_D = createToken({ name: "LLAVE_D", pattern: /\}/ });
TOKENS.unshift(LLAVE_D);

/* PUNTO Y COMA, COMA, ORACIÓN.
***********************************************/

const PUNTO_COMA = createToken({ name: "PUNTO_COMA", pattern: /;/ });
TOKENS.unshift(PUNTO_COMA);

const COMA = createToken({ name: "COMA", pattern: /,/ });
TOKENS.unshift(COMA);

const FRASE = createToken({ name: "FRASE", pattern: /"(?:[^"\\]|\\.)*"/ });
TOKENS.unshift(FRASE);

/* NÚMERO.
***********************************************/

const NUMERO = createToken({ name: "NUMERO", pattern: /0|([1-9][0-9]*)/ });
TOKENS.unshift(NUMERO);

/* OPERADORES LÓGICOS.
***********************************************/

const MENOR = createToken({ name: "MENOR", pattern: /</ });
TOKENS.unshift(MENOR);

const MAYOR = createToken({ name: "MAYOR", pattern: />/ });
TOKENS.unshift(MAYOR);

const MENOR_IGUAL = createToken({ name: "MENOR_IGUAL", pattern: /<=/ });
TOKENS.unshift(MENOR_IGUAL);

const MAYOR_IGUAL = createToken({ name: "MAYOR_IGUAL", pattern: />=/ });
TOKENS.unshift(MAYOR_IGUAL);

const IGUAL = createToken({ name: "IGUAL", pattern: /ES/, longer_alt: IDENTIFICADOR });
TOKENS.unshift(IGUAL);

/* OPERADORES ARITMÉTICOS.
***********************************************/
const OPERADOR_ADITIVO = createToken({ name: "OPERADOR_ADITIVO", pattern: Lexer.NA });
TOKENS.unshift(OPERADOR_ADITIVO);

const OPERADOR_MULTIPLICATIVO = createToken({ name: "OPERADOR_MULTIPLICATIVO", pattern: Lexer.NA });
TOKENS.unshift(OPERADOR_MULTIPLICATIVO);

const MAS = createToken({ name: "MAS", pattern: /\+/, categories:  OPERADOR_ADITIVO });

const MENOS = createToken({ name: "MENOS", pattern: /\-/, categories: OPERADOR_ADITIVO });

const POR = createToken({ name: "POR", pattern: /\*/, categories: OPERADOR_MULTIPLICATIVO });

const ENTRE = createToken({ name: "ENTRE", pattern: /\//, categories: OPERADOR_MULTIPLICATIVO });

const ASIGNACION = createToken({ name: "ASIGNACION", pattern: /=/ });
TOKENS.unshift(ASIGNACION);

/* ESPACIOS EN BLANCO.
***********************************************/

const ESPACIOS = createToken({ name: "ESPACIOS", pattern: /[\s\t\n]+/, group: Lexer.SKIPPED });
TOKENS.unshift(ESPACIOS);

/* ANALIZADOR LEXICAL.
***********************************************/

const LEXER = new Lexer(TOKENS);

const tokenize = (inputText) => {
  const lexingResult = LEXER.tokenize(inputText);
  return lexingResult;
}

/* Vocabulario de tokens para usar en el parser. */

let tokenVocabulary = {};

TOKENS.forEach(token => {
  tokenVocabulary[token.name] = token;
});

module.exports.tokenize = tokenize;
module.exports.LEXER = LEXER;
module.exports.tokenVocabulary = tokenVocabulary;