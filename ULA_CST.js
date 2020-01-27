/* CST Visitor.
***********************************************/

const { tokenize } = require("./ULA_lexer");
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

    return node;
  }

  Expresion_matematica(ctx) {
    let node = { name: "Expresion_matematica", children: {} };

    return node;
  }

  Multiplicacion(ctx) {
    let node = { name: "Multiplicacion", children: {} };

    return node;
  }

  Operador_relacional(ctx) {
    let node = { name: "Operador_relacional", children: {} };

    return node;
  }

  Expresion_atomica(ctx) {
    let node = { name: "Expresion_atomica", children: {} };

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