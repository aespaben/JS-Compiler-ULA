/* PARSER.
***********************************************/
const { CstParser } = require("chevrotain");
const { tokenVocabulary: tv, tokenize } = require("./ULA_lexer");

class ULAParser extends CstParser {
  constructor() {
    super(tv);
    const $ = this;

    /* REGLA: Declarar y definir variable. */

    $.RULE("declararVariable", () => {
      $.SUBRULE($.keywordCrea);
      $.SUBRULE($.nombreVariable);
      $.SUBRULE($.puntoYComa);
    });

    $.RULE("keywordCrea", () => {
      $.CONSUME(tv.CREA);
    });

    $.RULE("nombreVariable", () => {
      $.CONSUME(tv.IDENTIFICADOR);
    });

    $.RULE("puntoYComa", () => {
      $.CONSUME(tv.PUNTO_COMA);
    });

    this.performSelfAnalysis();
  }
};

const PARSER = new ULAParser();

const parseInput = (inputText) => {
  PARSER.input = tokenize(inputText).tokens;
  
  let message = PARSER.declararVariable();

  return message !== undefined ? message : PARSER.errors;
};

module.exports.PARSER = PARSER;
module.exports.parseInput = parseInput;