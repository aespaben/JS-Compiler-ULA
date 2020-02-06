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
      argument: this.visit(ctx.Expresion)
    };
  }
  
  Lectura(ctx) {
    return {
      type: "Lectura",
      argument: ctx.IDENTIFICADOR[0].image
    };
  }

  Declaracion(ctx) {
    let node = {};
    

    if(ctx.Asignacion) {
      let asignacion = this.visit(ctx.Asignacion);
      node.type = "Definicion";
      node.name = asignacion.name;
      node.expression = asignacion.expression;      
    }
    else {
      node.type = "Declaracion";
      node.name = ctx.IDENTIFICADOR[0].image;
    }

    return node;
  }

  Asignacion(ctx) {
    let node = { type: "Asignacion" };

    node.name = ctx.IDENTIFICADOR[0].image;

    if(ctx.Expresion) {
      node.expression = this.visit(ctx.Expresion);
    }
    else {
      node.string = ctx.FRASE[0].image;
    }

    return node;
  }

  Decision(ctx) {
    let node = { type: "Decision" };

    node.expression = this.visit(ctx.Expresion);
    node.if_statements = [];

    ctx.Sentencia.forEach((e) => {
      node.if_statements.push(this.visit(ctx.Sentencia[0]));
    });

    if(ctx.SINO) {
      node.else_statements = [];
      ctx.Sentencia.forEach((e) => {
        node.else_statements.push(this.visit(ctx.Sentencia[1]));
      });
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
    let LI = LIVisit.value ? LIVisit.value : LIVisit.name;
    let LD = LDVisit.value ? LDVisit.value : LDVisit.name;   
    
    return {
      type: "Expresion",
      lhs: LI,
      operator: this.visit(ctx.Operador_relacional),
      rhs: LD
    };
  }

  Expresion_matematica(ctx) {
    let lhs = this.visit(ctx.LI);
    let rhs = "";
    let operator = "";

    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        rhs = this.visit(operandoLD);
        operator = ctx.OPERADOR_ADITIVO[i].image;

        /*
        if(tokenMatcher(operator, _.MAS)) {
          resultado += LDval;
        }
        else {
          resultado -= LDval;
        }
        */
       lhs += operator + rhs;
      }); 
      
    }

    
    return lhs;

    // return {
    //   type: "Expresion_aditiva",
    //   lhs: lhs,
    //   operator: operator,
    //   rhs: rhs
    // };
  }

  Multiplicacion(ctx) {
    let lhs = this.visit(ctx.LI);
    let rhs = "";
    let operator = "";

    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        rhs = this.visit(operandoLD);
        operator = ctx.OPERADOR_MULTIPLICATIVO[i].image;

        /*
        if(tokenMatcher(operator, _.POR)) {
          resultado *= LDval;
        }
        else {
          resultado /= LDval;
        }
        */
       lhs += operator + rhs;
      }); 
      
    }

    

    return lhs;
    // return {
    //   type: "Expresion_multiplicativa",
    //   lhs: lhs,
    //   operator: operator,
    //   rhs: rhs
    // };
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
      // return {
      //   type: "Numero",
      //   value: ctx.NUMERO[0].image
      // };
      return ctx.NUMERO[0].image;
    }
    else if(ctx.IDENTIFICADOR) {
      return {
        type: "Identificador",
        value: ctx.IDENTIFICADOR[0].image
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