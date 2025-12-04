import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos de /dist
app.use(express.static(path.join(__dirname, "dist")));

// EL FALLBACK UNIVERSAL PARA VUE (sin wildcards problematicos)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
