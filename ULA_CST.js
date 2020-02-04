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
    let node = { name: "Lectura", children: {} };
    node.children.LEE = ctx.LEE[0].image;
    node.children.PAREN_I = ctx.PAREN_I[0].image;
    node.children.IDENTIFICADOR = ctx.IDENTIFICADOR[0].image;
    node.children.PAREN_D = ctx.PAREN_D[0].image;
    node.children.PUNTO_COMA = ctx.PUNTO_COMA[0].image;

    return node;
  }

  Declaracion(ctx) {
    let node = { name: "Declaracion", children: {} };
    node.children.CREA = ctx.CREA[0].image;

    if(ctx.Asignacion) {
      node.children.Asignacion = this.visit(ctx.Asignacion);
    }
    else {
      node.children.IDENTIFICADOR = ctx.IDENTIFICADOR[0].image;
      node.children.PUNTO_COMA = ctx.PUNTO_COMA[0].image;
    }

    return node;
  }

  Asignacion(ctx) {
    let node = { name: "Asignacion", children: {} };

    node.children.IDENTIFICADOR = ctx.IDENTIFICADOR[0].image;
    node.children.ASIGNACION = ctx.ASIGNACION[0].image;

    if(ctx.Expresion) {
      node.children.Expresion = this.visit(ctx.Expresion);
    }
    else {
      node.children.FRASE = ctx.FRASE[0].image;
    }

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
    let LI = this.visit(ctx.LI).result ? ctx.LI.result : ctx.LI.image;
    let LD = this.visit(ctx.LD).result ? ctx.LD.result : ctx.LD.image;   
    
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
    let node = { name: "Operador_relacional", children: {} };

    if(ctx.MAYOR) {
      node.children.MAYOR = ctx.MAYOR[0].image;
    }
    else if(ctx.MAYOR_IGUAL) {
      node.children.MAYOR_IGUAL = ctx.MAYOR_IGUAL[0].image;
    }
    else if(ctx.MENOR) {
      node.children.MENOR = ctx.MENOR[0].image;
    }
    else if(ctx.MENOR_IGUAL) {
      node.children.MENOR_IGUAL = ctx.MENOR_IGUAL[0].image;
    }
    else if(ctx.IGUAL) {
      node.children.IGUAL = ctx.IGUAL[0].image;
    }

    return node;
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