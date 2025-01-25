const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

app.use(cors());
app.use(express.json());

pool.query("SELECT NOW()")
  .then((res) => console.log("Conexão com PostgreSQL está OK:", res.rows[0]))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));

// rota para buscar as duvidas
app.get("/api/questions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT produto AS name, ARRAY_AGG(duvida) AS questions
      FROM tDoubts
      GROUP BY produto
    `);
    res.json(result.rows); 
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    res.status(500).send("Erro no servidor");
  }
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
