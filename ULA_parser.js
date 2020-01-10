/* PARSER.
***********************************************/
const { CstParser } = require("chevrotain");
const { tokenVocabulary: tv, tokenize } = require("./ULA_lexer");

class ULAParser extends CstParser {
  constructor() {
    super(tv);
    const $ = this;

    $.RULE("Programa_ULA", () => {
      $.MANY(() => {
        $.SUBRULE($.Sentencia);
      });
    });

    $.RULE("Sentencia", () => {
      $.OR([
        {
          ALT: () => { $.SUBRULE($.Declaracion); }
        },
        {
          ALT: () => { $.SUBRULE($.Asignacion); }
        }
      ]);
    });

    $.RULE("Declaracion", () => {
      $.CONSUME(tv.CREA);
      $.CONSUME(tv.IDENTIFICADOR);
      $.CONSUME(tv.PUNTO_COMA);
    });

    $.RULE("Asignacion", () => {
      $.CONSUME(tv.IDENTIFICADOR);
      $.CONSUME(tv.ASIGNACION);
      $.SUBRULE($.Expresion);
    });

    $.RULE("Expresion", () => {
      $.OR([
        {
          ALT: () => { $.CONSUME(tv.NUMERO); }
        },
        {
          ALT: () => { $.CONSUME(tv.FRASE); }
        }
      ]);
    });

    /* REGLA: Declarar y definir variable. */

    // $.RULE("declararVariable", () => {
    //   $.SUBRULE($.keywordCrea);
    //   $.SUBRULE($.nombreVariable);
    //   $.SUBRULE($.puntoYComa);
    // });

    // $.RULE("keywordCrea", () => {
    //   $.CONSUME(tv.CREA);
    // });

    // $.RULE("nombreVariable", () => {
    //   $.CONSUME(tv.IDENTIFICADOR);
    // });

    // $.RULE("puntoYComa", () => {
    //   $.CONSUME(tv.PUNTO_COMA);
    // });

    this.performSelfAnalysis();
  }
};

const PARSER = new ULAParser();

const parseInput = (inputText) => {
  PARSER.input = tokenize(inputText).tokens;
  
  let message = PARSER.Programa_ULA();

  return message !== undefined ? message : PARSER.errors;
};

module.exports.PARSER = PARSER;
module.exports.parseInput = parseInput;