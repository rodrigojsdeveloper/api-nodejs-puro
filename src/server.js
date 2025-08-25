import http from "node:http";
import { routes } from "./routes.js";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  const route = routes.find(r => {
    if (r.method !== method) return false;

    if (r.path.includes(":id")) {
      return url.startsWith(r.path.split("/:")[0]);
    }

    return r.path === url;
  });

  if (!route) {
    res.writeHead(404).end(JSON.stringify({ message: "Rota não encontrada" }));
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));

  req.on("end", () => {
    req.body = body ? JSON.parse(body) : null;

    req.params = {};
    if (route.path.includes(":id")) {
      req.params.id = url.split("/").pop();
    }

    res.setHeader("Content-Type", "application/json");
    route.handler(req, res);
  });
});

server.listen(8000, () => console.log("🚀 Server rodando em http://localhost:8000"));
