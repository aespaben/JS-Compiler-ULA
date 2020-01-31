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
    let node = { name: "Programa_ULA" };

    if(ctx.Sentencia) {
      ctx.Sentencia.forEach(e => {
        node.children = this.visit(e);
      });
    }

    return node;
  }

  Sentencia(ctx) {
    let node = { name: "Sentencia", Sentencia: [] };
   
    if(ctx.Lectura) {
      node.Sentencia.push(this.visit(ctx.Lectura));
    }
    else if(ctx.Declaracion) {
      node.Sentencia.push(this.visit(ctx.Declaracion));
    }
    else if(ctx.Asignacion) {
      node.Sentencia.push(this.visit(ctx.Asignacion));
    }

    return node;
  }

  /************ TODO ************/
  Impresion(ctx) {
    let node = { name: "Impresion", children: {} };

    return node;
  }

  Lectura(ctx) {
    let node = { name: "Lectura", children: {} };
    node.children.LEE = ctx.LEE;
    node.children.PAREN_I = ctx.PAREN_I;
    node.children.IDENTIFICADOR = ctx.IDENTIFICADOR;
    node.children.PAREN_D = ctx.PAREN_D;
    node.children.PUNTO_COMA = ctx.PUNTO_COMA;

    return node;
  }

  Declaracion(ctx) {
    let node = { name: "Declaracion", children: {} };
    node.children.CREA = ctx.CREA;

    if(ctx.Asignacion) {
      node.children.Asignacion = this.visit(ctx.Asignacion);
    }
    else {
      node.children.IDENTIFICADOR = ctx.IDENTIFICADOR;
      node.children.PUNTO_COMA = ctx.PUNTO_COMA;
    }

    return node;
  }

  Asignacion(ctx) {
    let node = { name: "Asignacion", children: {} };

    node.children.IDENTIFICADOR = ctx.IDENTIFICADOR;
    node.children.ASIGNACION = ctx.ASIGNACION;

    if(ctx.Expresion) {
      node.children.Expresion = this.visit(ctx.Expresion);
    }
    else {
      node.children.FRASE = ctx.FRASE;
    }

    return node;
  }

  Expresion(ctx) {
    let node = { name: "Expresion", children: {} };

    if(ctx.Expresion_logica) {
      node.children.Expresion_logica = this.visit(ctx.Expresion_logica);
    }
    else {
      node.children.Expresion_matematica = this.visit(ctx.Expresion_matematica);
    }

    return node;
  }

  Expresion_logica(ctx) {
    let node = { name: "Expresion_logica", children: {} };

    node.children.LI = this.visit(ctx.LI);
    node.children.Operador_relacional = this.visit(ctx.Operador_relacional);
    node.children.LI = this.visit(ctx.LD);

    return node;
  }

  Expresion_matematica(ctx) {
    let node = { name: "Expresion_matematica", children: {} };

    let resultado = this.visit(ctx.LI).children.RESULTADO;
        
    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        let LDval = this.visit(operandoLD).children.RESULTADO;
        let operator = ctx.OPERADOR_ADITIVO[i];

        if(tokenMatcher(operator, _.MAS)) {
          resultado += LDval;
        }
        else {
          resultado -= LDval;
        }
      }); 
    }

    node.children.RESULTADO = resultado;
    return node;
  }

  Multiplicacion(ctx) {
    let node = { name: "Multiplicacion", children: {} };

    let resultado = this.visit(ctx.LI).children.NUMERO;
    
    if(ctx.LD) {
      ctx.LD.forEach((operandoLD, i) => {
        let LDval = this.visit(operandoLD).children.NUMERO;
        let operator = ctx.OPERADOR_MULTIPLICATIVO[i];

        if(tokenMatcher(operator, _.POR)) {
          resultado *= LDval;
        }
        else {
          resultado /= LDval;
        }
      }); 
    }

    node.children.RESULTADO = resultado;

    return node;
  }

  Operador_relacional(ctx) {
    let node = { name: "Operador_relacional", children: {} };

    if(ctx.MAYOR) {
      node.children.MAYOR = ctx.MAYOR;
    }
    else if(ctx.MAYOR_IGUAL) {
      node.children.MAYOR_IGUAL = ctx.MAYOR_IGUAL;
    }
    else if(ctx.MENOR) {
      node.children.MENOR = ctx.MENOR;
    }
    else if(ctx.MENOR_IGUAL) {
      node.children.MENOR_IGUAL = ctx.MENOR_IGUAL;
    }
    else if(ctx.IGUAL) {
      node.children.IGUAL = ctx.IGUAL;
    }

    return node;
  }

  Expresion_atomica(ctx) {
    let node = { name: "Expresion_atomica", children: {} };

    if(ctx.NUMERO) {
      node.children.NUMERO = parseFloat(ctx.NUMERO[0].image);
    }
    else if(ctx.IDENTIFICADOR) {
      node.children.IDENTIFICADOR = ctx.IDENTIFICADOR;
    }

    return node;
  }
}

const toAsrVisitorIntance = new ULAtoAstVisitor();

module.exports = {
  toAst: function(inputText) {
    const lexResult = tokenize(inputText);
    PARSER.input = lexResult.tokens;

    const cst = PARSER.Programa_ULA();

    if(PARSER.errors.length > 0) {
      console.log("-- Se encontraron errores en el programa -- \n" + PARSER.errors[0].message);
    }

    const ast = toAsrVisitorIntance.visit(cst);

    return ast;
  }
};