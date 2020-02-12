const fs = require("fs");
const { toAst } = require("./ULA_CST");

let code = fs.readFileSync("program.ula").toString();

let ast = toAst(code);

if(ast === undefined) {
  return;
}

let transpiled_code = "";
console.log(JSON.stringify(ast, null, 4));
if(ast.body) {
  ast.body.forEach(e => {
    if(e.type === "Declaracion") {
      transpiled_code += `let ${e.name};\n`;
    }

    if(e.type === "Asignacion") {
      transpiled_code += `${e.name} = ${e.expression.value};\n`;
    }

    if(e.type === "Impresion") {
      if(e.param.value) {
        transpiled_code += `console.log(${e.param.value});\n`;
      }
    }
  });

  fs.writeFileSync("ula_output.js", transpiled_code);

  // try {
  //   eval(transpiled_code);
  // }
  // catch(e) {
  //   if(e instanceof SyntaxError) {
  //     console.log(e.message);
  //   }
  // }
}

