/* PARSER.
***********************************************/
const { CstParser } = require("chevrotain");
const { tokenVocabulary: _, tokenize } = require("./ULA_lexer");

class ULAParser extends CstParser {
  constructor() {
    super(_);
    const $ = this;

    /* Programa principal.  */
    $.RULE("Programa_ULA", () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => { $.SUBRULE($.Declaracion); } },
          { ALT: () => { $.SUBRULE($.Asignacion); } },
          { ALT: () => { $.SUBRULE($.Impresion); } },
          { ALT: () => { $.SUBRULE($.Lectura); } },
          { ALT: () => { $.SUBRULE($.Decision); } },
          { ALT: () => { $.SUBRULE($.Repeticion); } }
        ]);
      });
    });

    /* Reglas principales. */
    $.RULE("Declaracion", () => {
      $.CONSUME(_.CREA);
      $.OR([
        { ALT: () => { $.SUBRULE($.Asignacion); } },
        { 
          ALT: () => { 
            $.CONSUME(_.IDENTIFICADOR);
            $.CONSUME(_.PUNTO_COMA);
          } 
        }
      ]);      
    });

    $.RULE("Asignacion", () => {
      $.CONSUME(_.IDENTIFICADOR);
      $.CONSUME(_.ASIGNACION);
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion); } },
        { ALT: () => { $.CONSUME(_.FRASE); } }
      ]);
      $.CONSUME(_.PUNTO_COMA);
    });

    $.RULE("Impresion", () => {
      $.CONSUME(_.MUESTRA);
      $.CONSUME(_.PAREN_I);
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion); } }
      ]);
      $.CONSUME(_.PAREN_D);
      $.CONSUME(_.PUNTO_COMA);
    });

    $.RULE("Lectura", () => {
      $.CONSUME(_.LEE);
      $.CONSUME(_.PAREN_I);
      $.CONSUME(_.IDENTIFICADOR);
      $.CONSUME(_.PAREN_D);
      $.CONSUME(_.PUNTO_COMA);
    });

    $.RULE("Decision", () => {
      $.CONSUME(_.SI);
      $.CONSUME(_.PAREN_I);
      $.SUBRULE($.Expresion);
      $.CONSUME(_.PAREN_D);
      $.CONSUME(_.ENTONCES);
      $.CONSUME(_.LLAVE_I);
      $.AT_LEAST_ONE(() => {
        $.OR([
          { ALT: () => { $.SUBRULE($.Declaracion); } },
          { ALT: () => { $.SUBRULE($.Asignacion); } },
          { ALT: () => { $.SUBRULE($.Impresion); } },
          { ALT: () => { $.SUBRULE($.Lectura); } },
          { ALT: () => { $.SUBRULE($.Decision); } },
          { ALT: () => { $.SUBRULE($.Repeticion); } }
        ]);
      });
      $.CONSUME(_.LLAVE_D);
      $.OPTION(() => {
        $.CONSUME(_.SINO);
        $.CONSUME2(_.LLAVE_I);
        $.AT_LEAST_ONE2(() => {
          $.OR2([
            { ALT: () => { $.SUBRULE2($.Declaracion); } },
            { ALT: () => { $.SUBRULE2($.Asignacion); } },
            { ALT: () => { $.SUBRULE2($.Impresion); } },
            { ALT: () => { $.SUBRULE2($.Lectura); } },
            { ALT: () => { $.SUBRULE2($.Decision); } },
            { ALT: () => { $.SUBRULE2($.Repeticion); } }
          ]);
        });
        $.CONSUME2(_.LLAVE_D);
      });
    });

    $.RULE("Repeticion", () => {
      $.CONSUME(_.REPITE);
      $.OR([
        { ALT: () => { $.CONSUME(_.NUMERO); } },
        { ALT: () => { $.CONSUME(_.IDENTIFICADOR); } }
      ]);
      $.CONSUME(_.VECES);
      $.CONSUME(_.LLAVE_I);
      $.AT_LEAST_ONE(() => {
        $.OR2([
          { ALT: () => { $.SUBRULE($.Declaracion); } },
          { ALT: () => { $.SUBRULE($.Asignacion); } },
          { ALT: () => { $.SUBRULE($.Impresion); } },
          { ALT: () => { $.SUBRULE($.Lectura); } },
          { ALT: () => { $.SUBRULE($.Decision); } },
          { ALT: () => { $.SUBRULE($.Repeticion); } }
        ]);
      });
      $.CONSUME(_.LLAVE_D);
    });      

    /* Reglas secundarias. */
    $.RULE("Expresion", () => {
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion_logica); } },
        { ALT: () => { $.SUBRULE($.Expresion_matematica); } },
      ]);
    });    

    $.RULE("Expresion_logica", () => {
      $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
      $.SUBRULE($.Operador_relacional);
      $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });
    });

    $.RULE("Expresion_atomica", () => {
      $.OR([
        { ALT: () => { $.CONSUME(_.NUMERO); } },
        { ALT: () => { $.CONSUME(_.IDENTIFICADOR); } }
      ]);
    });

    $.RULE("Operador_relacional", () => {
      $.OR([
        { ALT: () => { $.CONSUME(_.MAYOR); } },
        { ALT: () => { $.CONSUME(_.MAYOR_IGUAL); } },
        { ALT: () => { $.CONSUME(_.MENOR); } },
        { ALT: () => { $.CONSUME(_.MENOR_IGUAL); } },
        { ALT: () => { $.CONSUME(_.IGUAL); } }
      ]);
    });

    $.RULE("Expresion_matematica", () => {
      $.SUBRULE($.Expresion_atomica);
      $.MANY(() => {
        $.SUBRULE($.Operador_matematico);
        $.SUBRULE2($.Expresion_atomica);
      });       
    });

    $.RULE("Operador_matematico", () => {
      $.OR([
        { ALT: () => { $.CONSUME(_.MAS); } },
        { ALT: () => { $.CONSUME(_.MENOS); } },
        { ALT: () => { $.CONSUME(_.POR); } },
        { ALT: () => { $.CONSUME(_.ENTRE); } }
      ]);
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