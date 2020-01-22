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
    let node = {};

    if(ctx.Declaracion) {
      node.Declaracion = this.visit(ctx.Declaracion);
    }
    else if(ctx.Asignacion) {
      node.Asignacion = this.visit(ctx.Asignacion);
    }
    else if(ctx.Impresion) {
      node.Impresion = this.visit(ctx.Impresion);
    }
    else if(ctx.Lectura) {
      node.Lectura = this.visit(ctx.Lectura);
    }
    else if(ctx.Decision) {
      node.Decision = this.visit(ctx.Decision);
    }
    else if(ctx.Repeticion) {
      node.Repeticion = this.visit(ctx.Repeticion);
    }

    return node;
  }

  Declaracion(ctx) {
    const crea = ctx.CREA[0].image;

    let node = {};
    node.CREA = crea;
    if(ctx.Asignacion) {
      node.Asignacion = this.visit(ctx.Asignacion);
    }
    else {
      node.Identificador = ctx.IDENTIFICADOR[0].image;
      node.Punto_y_coma = ctx.PUNTO_COMA[0].image;
    }

    return node;
  }

  /* TODO:
      - Agregar métodos restantes:
      <Asignacion>.
      <Impresion>.
      <Lectura>.
      <Decision>.
      <Repeticion>.
      <Expresion>.
      <Expresion_logica>.
      <Expresion_atomica>.
      <Operador_relacional>.
      <Expresion_matematica>.
      <Operador_matematico>.
  */
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