/* CST Visitor.
***********************************************/

const { tokenMatcher } = require("chevrotain");
const { tokenize, tokenVocabulary: _ } = require("./ULA_lexer");
const parser = require("./ULA_parser");
const ULAParser = parser.ULAParser;
const PARSER = new ULAParser([]);
const BaseULAVisitor = PARSER.getBaseCstVisitorConstructor();


class ULAtoAstVisitor extends BaseULAVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  /* Aquí comienzan las reglas de construcción del AST... */

  Programa_ULA(ctx) {
    let node = { type: "Programa_ULA", body: [] };

    if(ctx.Sentencia) {
      ctx.Sentencia.forEach(e => {
        node.body.push(this.visit(e));
      });
    }

    return node;
  }

  Sentencia(ctx) {
    if(ctx.Impresion) {
      return this.visit(ctx.Impresion);
    }
    else if(ctx.Lectura) {
      return this.visit(ctx.Lectura);
    }
    else if(ctx.Declaracion) {
      return this.visit(ctx.Declaracion);
    }
    else if(ctx.Asignacion) {
      return this.visit(ctx.Asignacion);
    }
    else if(ctx.Decision) {
      return this.visit(ctx.Decision);
    }
    else if(ctx.Repeticion) {
      return this.visit(ctx.Repeticion);
    }
    
    return undefined;
  }

  
  Impresion(ctx) {
    
    return {
      type: "Impresion",
      structure: {
        MUESTRA: ctx.MUESTRA[0].image,
        PAREN_I: ctx.PAREN_I[0].image,
        Expresion: this.visit(ctx.Expresion),
        PAREN_D: ctx.PAREN_D[0].image,
        PUNTO_COMA: ctx.PUNTO_COMA[0].image
      }
    }
  }
  
  Lectura(ctx) {
    return {
      type: "Lectura",
      structure: {
        LEE: ctx.LEE[0].image,
        PAREN_I: ctx.PAREN_I[0].image,
        IDENTIFICADOR: ctx.IDENTIFICADOR[0].image,
        PAREN_D: ctx.PAREN_D[0].image,
        PUNTO_COMA: ctx.PUNTO_COMA[0].image
      }
    };
  }

  Declaracion(ctx) {
    let node = { type: "Declaracion", structure: {} };
    node.structure.CREA = ctx.CREA[0].image;

    if(ctx.Asignacion) {
      node.structure.Asignacion = this.visit(ctx.Asignacion);
    }
    else {
      node.structure.IDENTIFICADOR = ctx.IDENTIFICADOR[0].image;
      node.structure.PUNTO_COMA = ctx.PUNTO_COMA[0].image;
    }

    return node;
  }

  Asignacion(ctx) {
    let node = { type: "Asignacion", structure: {} };

    node.structure.IDENTIFICADOR = ctx.IDENTIFICADOR[0].image;
    node.structure.ASIGNACION = ctx.ASIGNACION[0].image;

    if(ctx.Expresion) {
      node.structure.Expresion = this.visit(ctx.Expresion);
    }
    else {
      node.structure.FRASE = ctx.FRASE[0].image;
    }

    return node;
  }

  Decision(ctx) {
    let node = { type: "Decision", structure: {} };

    node.structure.SI = ctx.SI[0].image;
    node.structure.PAREN_I_1 = ctx.PAREN_I[0].image;
    node.structure.Expresion = this.visit(ctx.Expresion);
    node.structure.PAREN_D_1 = ctx.PAREN_D[0].image;
    node.structure.ENTONCES = ctx.ENTONCES[0].image;
    node.structure.LLAVE_I_1 = ctx.LLAVE_I[0].image;
    node.structure.Sentencia_1 = [];

    ctx.Sentencia.forEach((e) => {
      node.structure.Sentencia_1.push(this.visit(ctx.Sentencia[0]));
    });

    node.structure.LLAVE_D_1 = ctx.LLAVE_D[0].image;

    if(ctx.SINO) {
      node.structure.SINO = ctx.SINO[0].image;
      node.structure.LLAVE_I_2 = ctx.LLAVE_I[1].image;
      node.structure.Sentencia_2 = [];
      ctx.Sentencia.forEach((e) => {
        node.structure.Sentencia_2.push(this.visit(ctx.Sentencia[1]));
      });

      node.structure.LLAVE_D_2 = ctx.LLAVE_D[1].image;
    }
    return node;
  }

  Repeticion(ctx) {
    let node = { type: "Repeticion", structure: {} };

    return node;
  }

  Expresion(ctx) {
    if(ctx.Expresion_logica) {
      return this.visit(ctx.Expresion_logica);      
    }
    else {
      return this.visit(ctx.Expresion_matematica);      
    }
  }

  Expresion_logica(ctx) {
    let LIVisit = this.visit(ctx.LI);
    let LDVisit = this.visit(ctx.LD);
    let LI = LIVisit.result ? LIVisit.result : LIVisit.image;
    let LD = LDVisit.result ? LDVisit.result : LDVisit.image;   
    
    return {
      type: "Expresion_logica",
      structure: {
        LI: LI,
        Operador_relacional: this.visit(ctx.Operador_relacional),
        LD: LD
      }
    };
  }

  Expresion_matematica(ctx) {
    
    let resultado = this.visit(ctx.LI).result;
        
    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        let LDval = this.visit(operandoLD).result;
        let operator = ctx.OPERADOR_ADITIVO[i];

        if(tokenMatcher(operator, _.MAS)) {
          resultado += LDval;
        }
        else {
          resultado -= LDval;
        }
      }); 
    }

    return {
      type: "Expresion_matematica",
      result: resultado
    };
  }

  Multiplicacion(ctx) {
    let resultado = this.visit(ctx.LI).result;
    
    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        let LDval = this.visit(operandoLD).result;
        let operator = ctx.OPERADOR_MULTIPLICATIVO[i];

        if(tokenMatcher(operator, _.POR)) {
          resultado *= LDval;
        }
        else {
          resultado /= LDval;
        }
      }); 
    }

    return {
      type: "Multiplicacion",
      result: resultado
    };
  }

  Operador_relacional(ctx) {
    if(ctx.MAYOR) {
      return ctx.MAYOR[0].image;
    }
    else if(ctx.MAYOR_IGUAL) {
      return ctx.MAYOR_IGUAL[0].image;
    }
    else if(ctx.MENOR) {
      return ctx.MENOR[0].image;
    }
    else if(ctx.MENOR_IGUAL) {
      return ctx.MENOR_IGUAL[0].image;
    }
    else if(ctx.IGUAL) {
      return ctx.IGUAL[0].image;
    }

    return undefined;
  }

  Expresion_atomica(ctx) {
    if(ctx.NUMERO) {
      return {
        type: "Numero",
        result: parseFloat(ctx.NUMERO[0].image)
      };
    }
    else if(ctx.IDENTIFICADOR) {
      return {
        type: "Identificador",
        image: ctx.IDENTIFICADOR[0].image
      };
    }

    return undefined;
  }
}

const toAstVisitorIntance = new ULAtoAstVisitor();

module.exports = {
  toAst: function(inputText) {
    const lexResult = tokenize(inputText);
    PARSER.input = lexResult.tokens;

    const cst = PARSER.Programa_ULA();

    if(PARSER.errors.length > 0) {
      console.log("-- Se encontraron errores en el programa -- \n" + PARSER.errors[0].message);
    }

    const ast = toAstVisitorIntance.visit(cst);

    return ast;
  }
};