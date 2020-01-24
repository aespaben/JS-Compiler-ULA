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

  /*
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

  Asignacion(ctx) {
    let node = {};

    node.Identificador = ctx.IDENTIFICADOR[0].image;
    node.Asignacion = ctx.ASIGNACION[0].image;

    if(ctx.Expresion) {
      node.Expresion = this.visit(ctx.Expresion);
    }
    else if(ctx.FRASE) {
      node.Frase = ctx.FRASE[0].image;
    }

    node.Punto_y_coma = ctx.PUNTO_COMA[0].image;

    return node;
  }

  Impresion(ctx) {
    let node = {};

    node.Impresion = ctx.MUESTRA[0].image;
    node.Parentesis_izq = ctx.PAREN_I[0].image;
    node.Expresion = this.visit(ctx.Expresion);
    node.Parentesis_der = ctx.PAREN_D[0].image;
    node.Punto_y_coma = ctx.PUNTO_COMA[0].image;

    return node;
  }
*/

  Lectura(ctx) {
    let node = { name: "Lectura", children: {} };
    node.children.LEE = ctx.LEE;
    node.children.PAREN_I = ctx.PAREN_I;
    node.children.IDENTIFICADOR = ctx.IDENTIFICADOR;
    node.children.PAREN_D = ctx.PAREN_D;
    node.children.PUNTO_COMA = ctx.PUNTO_COMA;

    return node;
  }
/*
  Decision(ctx) {
    let node = {};

    node.Si = ctx.SI[0].image;
    node.Parentesis_izq = ctx.PAREN_I[0].image;
    node.Expresion = this.visit(ctx.Expresion);
    node.Parentesis_der = ctx.PAREN_D[0].image;
    node.Entonces = ctx.ENTONCES[0].image;
    node.Llave_izq = ctx.LLAVE_I[0].image;
    
    if(ctx.Declaracion) {
      node.Declaracion = [];
      ctx.Declaracion.forEach(e => {
        node.Declaracion.push(this.visit(e));
      });
    }
    if(ctx.Asignacion) {
      node.Asignacion = [];
      ctx.Asignacion.forEach(e => {
        node.Asignacion.push(this.visit(e));
      });
    }
    if(ctx.Impresion) {
      node.Impresion = [];
      ctx.Impresion.forEach(e => {
        node.Impresion.push(this.visit(e));
      });
    }
    if(ctx.Lectura) {
      node.Lectura = [];
      ctx.Lectura.forEach(e => {
        node.Lectura.push(this.visit(e));
      });
    }
    if(ctx.Decision) {
      node.Decision = [];
      ctx.Decision.forEach(e => {
        node.Declaracion.push(this.visit(e));
      });
    }
    if(ctx.Repeticion) {
      node.Repeticion = [];
      ctx.Repeticion.forEach(e => {
        node.Repeticion.push(this.visit(e));
      });
    }

    node.Llave_izq = ctx.LLAVE_I[0].image;

    return node;
  }


  Expresion(ctx) {
    let node = {};

    if(ctx.Expesion_logica) {
      node.Expesion_logica = this.visit(ctx.Expresion);
    }
    else {
      node.Expresion_matematica = this.visit(ctx.Expresion_matematica);
    }

    return node;
  }

  Expresion_logica(ctx) {
    let node = {};

    node.LI = this.visit(ctx.LI);
    node.Operador_relacional = this.visit(ctx.Operador_relacional);
    node.LD = this.visit(ctx.LD);

    return node;
  }

  Expresion_atomica(ctx) {
    let node = {};

    if(ctx.NUMERO) {
      node.Numero = ctx.NUMERO[0].image;
    }
    else {
      node.Identificador = ctx.IDENTIFICADOR[0].image;
    }

    return node;
  }

  Operador_relacional(ctx) {
    let node = {};
    if(ctx.MAYOR) {
      node.Mayor = ctx.MAYOR[0].image;
    }
    else if(ctx.MENOR) {
      node.Menor = ctx.MENOR[0].image;
    }
    else if(ctx.MAYOR_IGUAL) {
      node.Mayor_igual = ctx.MAYOR_IGUAL[0].image;
    }
    else if(ctx.MENOR_IGUAL) {
      node.Menor_igual = ctx.MENOR_IGUAL[0].image;
    }
    else if(ctx.IGUAL) {
      node.Igual = ctx.IGUAL[0].image;
    }

    return node;
  }

  Expresion_matematica(ctx) {
    let node = {};

    node.LI = this.visit(ctx.LI);

    if(ctx.LD) {
      node.LD = [];
      ctx.LD.forEach((e, i) => {
        
      });
    }
  }*/
  /* TODO:
      - Agregar métodos restantes:
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