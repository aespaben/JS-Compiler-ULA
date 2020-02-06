const fs = require("fs");
const { toAst } = require("./ULA_CST");

let code = fs.readFileSync("program.ula").toString();

let ast = toAst(code);

if(ast === undefined) {
  return;
}

let transpiled_code = "";

if(ast.body) {
  ast.body.forEach(e => {
    if(e.type === "Declaracion") {
      transpiled_code += `let ${e.name};\n`;
    }

    if(e.type === "Asignacion") {
      transpiled_code += `${e.name} = ${e.expression};\n`;
    }

    if(e.type === "Impresion") {
      if(e.argument.type === "Identificador") {
        transpiled_code += `console.log(${e.argument.value});\n`;
      }
    }
  });

  // fs.writeFileSync("ula_output.js", transpiled_code);

  try {
    eval(transpiled_code);
  }
  catch(e) {
    if(e instanceof SyntaxError) {
      console.log(e.message);
    }
  }
}

