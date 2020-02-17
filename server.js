const http = require("http");

const server = http.createServer((req, res) => {
  if(req.url === "/") {
    res.write("Server running");
    res.end();
  }
  else {
    res.write("Error 404");
    res.end();
  }
});

server.listen("3000");