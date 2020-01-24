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
        $.SUBRULE($.Sentencia);
      });
    });

    $.RULE("Sentencia", () => {
      $.OR([
        // { ALT: () => { $.SUBRULE($.Declaracion); } },
        // { ALT: () => { $.SUBRULE($.Asignacion); } },
        // { ALT: () => { $.SUBRULE($.Impresion); } },
        { ALT: () => { $.SUBRULE($.Lectura); } },
        // { ALT: () => { $.SUBRULE($.Decision); } },
        // { ALT: () => { $.SUBRULE($.Repeticion); } }
      ]);
    });

    /* Reglas principales. */
    // $.RULE("Declaracion", () => {
    //   $.CONSUME(_.CREA);
    //   $.OR([
    //     { ALT: () => { $.SUBRULE($.Asignacion); } },
    //     { 
    //       ALT: () => { 
    //         $.CONSUME(_.IDENTIFICADOR);
    //         $.CONSUME(_.PUNTO_COMA);
    //       } 
    //     }
    //   ]);      
    // });

    // $.RULE("Asignacion", () => {
    //   $.CONSUME(_.IDENTIFICADOR);
    //   $.CONSUME(_.ASIGNACION);
    //   $.OR([
    //     { ALT: () => { $.SUBRULE($.Expresion); } },
    //     { ALT: () => { $.CONSUME(_.FRASE); } }
    //   ]);
    //   $.CONSUME(_.PUNTO_COMA);
    // });

    // $.RULE("Impresion", () => {
    //   $.CONSUME(_.MUESTRA);
    //   $.CONSUME(_.PAREN_I);
    //   $.SUBRULE($.Expresion);
    //   $.CONSUME(_.PAREN_D);
    //   $.CONSUME(_.PUNTO_COMA);
    // });

    $.RULE("Lectura", () => {
      $.CONSUME(_.LEE);
      $.CONSUME(_.PAREN_I);
      $.CONSUME(_.IDENTIFICADOR);
      $.CONSUME(_.PAREN_D);
      $.CONSUME(_.PUNTO_COMA);
    });

    // $.RULE("Decision", () => {
    //   $.CONSUME(_.SI);
    //   $.CONSUME(_.PAREN_I);
    //   $.SUBRULE($.Expresion);
    //   $.CONSUME(_.PAREN_D);
    //   $.CONSUME(_.ENTONCES);
    //   $.CONSUME(_.LLAVE_I);
    //   $.AT_LEAST_ONE(() => {
    //     $.SUBRULE($.Sentencia);
    //   });
    //   $.CONSUME(_.LLAVE_D);
    //   $.OPTION(() => {
    //     $.CONSUME(_.SINO);
    //     $.CONSUME2(_.LLAVE_I);
    //     $.AT_LEAST_ONE2(() => {
    //       $.SUBRULE2($.Sentencia)
    //     });
    //     $.CONSUME2(_.LLAVE_D);
    //   });
    // });

    // $.RULE("Repeticion", () => {
    //   $.CONSUME(_.REPITE);
    //   $.OR([
    //     { ALT: () => { $.CONSUME(_.NUMERO); } },
    //     { ALT: () => { $.CONSUME(_.IDENTIFICADOR); } }
    //   ]);
    //   $.CONSUME(_.VECES);
    //   $.CONSUME(_.LLAVE_I);
    //   $.AT_LEAST_ONE(() => {
    //     $.SUBRULE($.Sentencia);
    //   });
    //   $.CONSUME(_.LLAVE_D);
    // });      

    // /* Reglas secundarias. */
    // $.RULE("Expresion", () => {
    //   $.OR([
    //     { ALT: () => { $.SUBRULE($.Expresion_logica); } },
    //     { ALT: () => { $.SUBRULE($.Expresion_matematica); } },
    //   ]);
    // });    

    // $.RULE("Expresion_logica", () => {
    //   $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
    //   $.SUBRULE($.Operador_relacional);
    //   $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });
    // });

    // $.RULE("Expresion_atomica", () => {
    //   $.OR([
    //     { ALT: () => { $.CONSUME(_.NUMERO); } },
    //     { ALT: () => { $.CONSUME(_.IDENTIFICADOR); } }
    //   ]);
    // });

    // $.RULE("Operador_relacional", () => {
    //   $.OR([
    //     { ALT: () => { $.CONSUME(_.MAYOR); } },
    //     { ALT: () => { $.CONSUME(_.MAYOR_IGUAL); } },
    //     { ALT: () => { $.CONSUME(_.MENOR); } },
    //     { ALT: () => { $.CONSUME(_.MENOR_IGUAL); } },
    //     { ALT: () => { $.CONSUME(_.IGUAL); } }
    //   ]);
    // });

    // $.RULE("Expresion_matematica", () => {
    //   $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
    //   $.MANY(() => {
    //     $.SUBRULE($.Operador_matematico);
    //     $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });
    //   });       
    // });

    // $.RULE("Operador_matematico", () => {
    //   $.OR([
    //     { ALT: () => { $.CONSUME(_.MAS); } },
    //     { ALT: () => { $.CONSUME(_.MENOS); } },
    //     { ALT: () => { $.CONSUME(_.POR); } },
    //     { ALT: () => { $.CONSUME(_.ENTRE); } }
    //   ]);
    // });   

    this.performSelfAnalysis();
  }
};

const PARSER = new ULAParser();

const parseInput = (inputText) => {
  PARSER.input = tokenize(inputText).tokens;
  
  // let message = PARSER.Programa_ULA();
  PARSER.Programa_ULA();

  // return message !== undefined ? message : PARSER.errors;

  if(PARSER.errors.length > 0) {
    console.log("-- Se encontraron errores en el programa -- \n" + PARSER.errors[0].message);
  }  
};

module.exports.ULAParser = ULAParser;
module.exports.PARSER = PARSER;
module.exports.parseInput = parseInput;