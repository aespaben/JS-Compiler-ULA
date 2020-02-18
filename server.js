const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { generate } = require("./compiler/ULA_code_generator");

/* Middlewares. */

app.use("/public", express.static(path.join(__dirname, "static")));
app.use("/css", express.static(path.join(__dirname, "static", "css")));
app.use(bodyParser.urlencoded({ extended: false }));

/* Motor de plantillas. */

app.set("views", "./static/views");
app.set("view engine", "pug");

/* Variables de estado. */
let code = "";
let compilation = "";

/* Rutas. */

app.get("/", (req, res) => {
  res.render("index", { code, compilation } );
});

app.post("/", (req, res) => {
  code = req.body.editor;
  compilation = generate(code);
  res.render("index", { code, compilation });
});

/* Servidor. */

app.listen("3000", () => {
  console.log("Server running on port 3000");
});