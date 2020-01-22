/* CST Visitor.
***********************************************/

const { LEXER } = require("./ULA_lexer");
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
}