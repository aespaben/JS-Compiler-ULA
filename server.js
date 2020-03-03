const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { generate } = require("./compiler/ULA_code_generator");

/* Middlewares. */

app.use("/public", express.static(path.join(__dirname, "static")));
app.use("/css", express.static(path.join(__dirname, "static", "css")));
app.use("/js", express.static(path.join(__dirname, "static", "js")));
app.use(bodyParser.urlencoded({ extended: false }));

/* Motor de plantillas. */

app.set("views", "./static/views");
app.set("view engine", "pug");

/* Variables de estado. */
let code = "";
let compilation = "";

let old = console.log;
let c = "";
console.log = function (message) {
  if (typeof message == 'object') {
    c += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '\n';
  } else {
    c += message + '\n';
  }
}

/* Rutas. */

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/compiler", (req, res) => {
  c = "";
  res.render("compilador", { code, compilation: "" } );
});

app.post("/compiler", (req, res) => {
  if(req.body.reset) {
    c = "";
  }
  code = req.body.editor;
  compilation = generate(code);
  eval(compilation);
  res.render("compilador", { code, compilation: c });
});

/* Servidor. */

app.listen("3000", () => {
  old("Server running on port 3000");
});