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
    let node = { Sentencia: [] };
   
    if(ctx.Lectura) {
      node.Sentencia.push(this.visit(ctx.Lectura));
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