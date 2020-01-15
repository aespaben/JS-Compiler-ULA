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
        $.OR([
          { ALT: () => { $.SUBRULE($.Declaracion); } },
          { ALT: () => { $.SUBRULE($.Asignacion); } },
          { ALT: () => { $.SUBRULE($.Impresion); } },
          { ALT: () => { $.SUBRULE($.Lectura); } }
        ]);
      });
    });

    $.RULE("Declaracion", () => {
      $.CONSUME(tv.CREA);
      $.OR([
        { ALT: () => { $.SUBRULE($.Asignacion); } },
        { 
          ALT: () => { 
            $.CONSUME(tv.IDENTIFICADOR);
            $.CONSUME(tv.PUNTO_COMA);
          } 
        }
      ]);      
    });

    $.RULE("Asignacion", () => {
      $.CONSUME(tv.IDENTIFICADOR);
      $.CONSUME(tv.ASIGNACION);
      $.SUBRULE($.Expresion);
      $.CONSUME(tv.PUNTO_COMA);
    });

    $.RULE("Impresion", () => {
      $.CONSUME(tv.MUESTRA);
      $.CONSUME(tv.PAREN_I);
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion); } },
        { ALT: () => { $.CONSUME(tv.IDENTIFICADOR); } }        
      ]);
      $.CONSUME(tv.PAREN_D);
      $.CONSUME(tv.PUNTO_COMA);
    });

    $.RULE("Expresion", () => {
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion_logica); } },
        { ALT: () => { $.SUBRULE($.Expresion_matematica); } }
      ]);
    });    

    $.RULE("Expresion_logica", () => {
      $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
      $.SUBRULE($.Operador_relacional);
      $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });
    });

    $.RULE("Expresion_atomica", () => {
      $.OR([
        { ALT: () => { $.CONSUME(tv.NUMERO); } },
        { ALT: () => { $.CONSUME(tv.IDENTIFICADOR); } }
      ]);
    });

    $.RULE("Operador_relacional", () => {
      $.OR([
        { ALT: () => { $.CONSUME(tv.MAYOR); } },
        { ALT: () => { $.CONSUME(tv.MAYOR_IGUAL); } },
        { ALT: () => { $.CONSUME(tv.MENOR); } },
        { ALT: () => { $.CONSUME(tv.MENOR_IGUAL); } },
        { ALT: () => { $.CONSUME(tv.IGUAL); } }
      ]);
    });

    $.RULE("Expresion_matematica", () => {
      $.CONSUME(tv.NUMERO);
      $.MANY(() => {
        $.SUBRULE($.Operador_matematico);
        $.CONSUME2(tv.NUMERO);
      });       
    });

    $.RULE("Operador_matematico", () => {
      $.OR([
        { ALT: () => { $.CONSUME(tv.MAS); } },
        { ALT: () => { $.CONSUME(tv.MENOS); } },
        { ALT: () => { $.CONSUME(tv.POR); } },
        { ALT: () => { $.CONSUME(tv.ENTRE); } }
      ]);
    });

    $.RULE("Lectura", () => {
      $.CONSUME(tv.LEE);
      $.CONSUME(tv.PAREN_I);
      $.CONSUME(tv.IDENTIFICADOR);
      $.CONSUME(tv.PAREN_D);
      $.CONSUME(tv.PUNTO_COMA);
    });

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