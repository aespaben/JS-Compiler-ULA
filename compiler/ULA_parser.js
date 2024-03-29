/* PARSER.
***********************************************/
const { CstParser } = require("chevrotain");
const { tokenVocabulary: _, tokenize } = require("./ULA_lexer");
const { errorProvider } = require("./ULA_error_provider");

class ULAParser extends CstParser {
  constructor() {
    super(_, { errorMessageProvider: errorProvider });
    const $ = this;

    /* Programa principal.  */
    $.RULE("Programa_ULA", () => {
      $.MANY(() => {
        $.SUBRULE($.Sentencia);
      });
    });

    $.RULE("Sentencia", () => {
      $.OR([
        { ALT: () => { $.SUBRULE($.Declaracion); } },
        { ALT: () => { $.SUBRULE($.Asignacion); } },
        { ALT: () => { $.SUBRULE($.Impresion); } },
        { ALT: () => { $.SUBRULE($.Lectura); } },
        { ALT: () => { $.SUBRULE($.Decision); } },
        { ALT: () => { $.SUBRULE($.Repeticion); } }
      ]);
    });

    $.RULE("Sentencia_simple", () => {
      $.OR([
        { ALT: () => { $.SUBRULE($.Declaracion); } },
        { ALT: () => { $.SUBRULE($.Asignacion); } },
        { ALT: () => { $.SUBRULE($.Impresion); } },
        { ALT: () => { $.SUBRULE($.Lectura); } }        
      ]);
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
        { ALT: () => { $.SUBRULE($.Expresion); } },
        { ALT: () => { $.CONSUME(_.FRASE); } }
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
        $.SUBRULE($.Sentencia_simple);
      });
      $.CONSUME(_.LLAVE_D);
      $.OPTION(() => {
        $.SUBRULE($.Sino);
      });
    });

    $.RULE("Sino", () => {
      $.CONSUME(_.SINO);
        $.CONSUME(_.LLAVE_I);
        $.AT_LEAST_ONE(() => {
          $.SUBRULE($.Sentencia_simple);
        });
        $.CONSUME(_.LLAVE_D);
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
        $.SUBRULE($.Sentencia_simple);
      });
      $.CONSUME(_.LLAVE_D);
    });      

    /* Reglas secundarias. */
    $.RULE("Expresion", () => {
      $.OR([
        { ALT: () => { $.SUBRULE($.Expresion_logica); } },
        { ALT: () => { $.SUBRULE($.Expresion_matematica); } }
      ]);
    });    

    $.RULE("Expresion_logica", () => {
      $.OR([
        { ALT: () => { $.CONSUME(_.CIERTO); }},
        { ALT: () => { $.CONSUME(_.FALSO); }},
        { ALT: () => {
          $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
          $.SUBRULE($.Operador_relacional);
          $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });}}
      ]);
      
    });

    $.RULE("Expresion_atomica", () => {
      $.OR([
        { ALT: () => { $.CONSUME(_.NUMERO); } },
        { ALT: () => { $.CONSUME(_.IDENTIFICADOR); } },
        // { ALT: () => { $.SUBRULE($.Expresion_parentesis); } }
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
      $.SUBRULE($.Multiplicacion, { LABEL: "LI" });
      $.MANY(() => {
        $.CONSUME(_.OPERADOR_ADITIVO);
        $.SUBRULE2($.Multiplicacion, { LABEL: "LD" });
      });       
    });

    // $.RULE("Expresion_parentesis", () => {
    //   $.CONSUME(_.PAREN_I);
    //   $.SUBRULE($.Expresion_matematica);
    //   $.CONSUME(_.PAREN_D);
    // });

    $.RULE("Multiplicacion", () => {
      $.SUBRULE($.Expresion_atomica, { LABEL: "LI" });
      $.MANY(() => {
        $.CONSUME(_.OPERADOR_MULTIPLICATIVO);
        $.SUBRULE2($.Expresion_atomica, { LABEL: "LD" });
      });       
    });

    this.performSelfAnalysis();
  }
};

const PARSER = new ULAParser();

const parseInput = (inputText) => {
  PARSER.input = tokenize(inputText).tokens;
  
  let message = PARSER.Programa_ULA();
  // PARSER.Programa_ULA();

  // console.log(JSON.stringify(message, null, 2));
  // return message !== undefined ? message : PARSER.errors;

  if(PARSER.errors.length > 0) {
    console.log("-- Se encontraron errores en el programa -- \n" + PARSER.errors[0].message);
  }  
};

module.exports.ULAParser = ULAParser;
module.exports.PARSER = PARSER;
module.exports.parseInput = parseInput;