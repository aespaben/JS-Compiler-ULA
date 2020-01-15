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
        { ALT: () => { $.SUBRULE($.Declaracion); } },
        { ALT: () => { $.SUBRULE($.Asignacion); } },
        // { ALT: () => { $.SUBRULE($.Decision); } }
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
      $.CONSUME(tv.PUNTO_COMA);
    });

    // $.RULE("Decision", () => {
    //   $.CONSUME(tv.SI);
    //   $.CONSUME(tv.PAREN_I);
    //   $.OR([
    //      { ALT: () => { $.SUBRULE($.Expresion); } },
    //     { ALT: () => { $.SUBRULE($.Comparacion); } }
    //   ]);
    //   $.CONSUME(tv.PAREN_D);
    //   $.CONSUME(tv.ENTONCES);
    //   $.SUBRULE($.Sentencia);
    //   $.OPTION(() => {
    //     $.CONSUME(tv.SINO);
    //     $.SUBRULE2($.Sentencia);
    //   });
    // });

    $.RULE("Expresion", () => {
      $.OR([
        { ALT: () => { $.CONSUME(tv.NUMERO); } },
        { ALT: () => { $.CONSUME(tv.FRASE); } },
        { ALT: () => { $.CONSUME(tv.CIERTO); } },
        { ALT: () => { $.CONSUME(tv.FALSO); } }
      ]);
    });

    // $.RULE("Comparacion", () => {
    //   $.SUBRULE($.Expresion);
    //   $.OR([
    //     { ALT: () => { $.CONSUME(tv.MENOR); } },
    //     { ALT: () => { $.CONSUME(tv.MAYOR); } },
    //     { ALT: () => { $.CONSUME(tv.MENOR_IGUAL); } },
    //     { ALT: () => { $.CONSUME(tv.MAYOR_IGUAL); } },
    //     { ALT: () => { $.CONSUME(tv.IGUAL); } }
    //   ]);
    //   $.SUBRULE2($.Expresion);
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