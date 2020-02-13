const { tokenVocabulary: _ } = require("./ULA_lexer");
const { defaultParserErrorProvider } = require("chevrotain");


const errorProvider = {
  buildMismatchTokenMessage: (options) => {
    if(options.expected === _.PUNTO_COMA) {
      return `Se esperaba ';', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    if(options.expected === _.LLAVE_I) {
      return `Se esperaba '{', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    if(options.expected === _.LLAVE_D) {
      return `Se esperaba '}', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    if(options.expected === _.PAREN_I) {
      return `Se esperaba '(', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    if(options.expected === _.PAREN_D) {
      return `Se esperaba ')', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    if(options.expected === _.ASIGNACION) {
      return `Se esperaba '=', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
    }
    

    return `Se esperaba '${options.expected}', pero se encontró '${options.previous.image}' en la línea ${options.previous.endLine}`;
  }
}

module.exports.errorProvider = errorProvider;