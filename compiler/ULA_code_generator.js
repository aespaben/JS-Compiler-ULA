const { toAst } = require("./ULA_CST");

generate = (code) => {

  let ast = toAst(code);

  if(ast === undefined) {
    return;
  }

  let transpiled_code = '"use strict";\n';

  if(ast.body) {
    ast.body.forEach(e => {
      if(e.type === "Declaracion") {
        transpiled_code += `let ${e.name};\n`;
      }

      if(e.type === "Definicion") {
        transpiled_code += `let ${e.name} = ${e.expression.value};\n`;
      }

      if(e.type === "Asignacion") {
        transpiled_code += `${e.name} = ${e.expression.value};\n`;
      }

      if(e.type === "Impresion") {
        if(e.expression) {
          transpiled_code += `console.log(${e.expression.value});\n`;
        }
      }

      // if(e.type === "Lectura") {
      //   transpiled_code += `${e.expression} = prompt("");\n`;
      // }

      if(e.type === "Decision") {
        if(e.expression.type === "Expresion_logica") {
          transpiled_code += `if(${e.expression.lhs} ${e.expression.operator} ${e.expression.rhs}) {\n`;
        }
        else if(e.expression.type === "Expresion_logica_atomica") {
          transpiled_code += `if(${e.expression.value}) {\n`;
        }

        e.statements.forEach((s) => {
          if(s.type === "Asignacion") {
            transpiled_code += `\t${s.name} = ${s.expression.value};\n`;
          }
          if(s.type === "Declaracion") {
            transpiled_code += `\tlet ${s.name};\n`;
          }

          if(s.type === "Definicion") {
            transpiled_code += `let ${s.name} = ${s.expression.value};\n`;
          }

          if(s.type === "Impresion") {
            if(s.expression) {
              transpiled_code += `console.log(${s.expression.value});\n`;
            }
          }
        });

        transpiled_code += `}\n`;
      }

      if(e.else) {
        transpiled_code += `else {\n`;

        e.else.statements.forEach((s) => {
          if(s.type === "Asignacion") {
            transpiled_code += `\t${s.name} = ${s.expression.value};\n`;
          }
          if(s.type === "Declaracion") {
            transpiled_code += `\tlet ${s.name};\n`;
          }

          if(s.type === "Definicion") {
            transpiled_code += `\tlet ${s.name} = ${s.expression.value};\n`;
          }

          if(s.type === "Impresion") {
            if(s.expression) {
              transpiled_code += `\tconsole.log(${s.expression.value});\n`;
            }
          }
        });

        transpiled_code += `}\n`;
      }

      if(e.type === "Repeticion") {
        transpiled_code += `for(let i = 0; i < ${e.times}; ++i) {\n`;
        e.statements.forEach((s) => {
          if(s.type === "Asignacion") {
            transpiled_code += `\t${s.name} = ${s.expression.value};\n`;
          }

          if(s.type === "Declaracion") {
            transpiled_code += `\tlet ${s.name};\n`;
          }

          if(s.type === "Definicion") {
            transpiled_code += `let ${s.name} = ${s.expression.value};\n`;
          }

          if(s.type === "Impresion") {
            if(s.expression.value) {
              transpiled_code += `console.log(${s.expression.value});\n`;
            }
          }
        });

        transpiled_code += `}\n`;
      }

    });

    return transpiled_code;
  }
}

module.exports = { generate };