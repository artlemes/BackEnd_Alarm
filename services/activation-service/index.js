const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const activationRoutes = require('./activationRoutes'); // Corrigido nome

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/activation', activationRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Erro interno' });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Activation service running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso.`);
    process.exit(1);
  } else {
    console.error('❌ Erro inesperado ao iniciar o servidor:', err);
  }
});
