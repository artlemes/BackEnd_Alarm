const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const alarmRoutes = require('./alarmRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/alarms', alarmRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Erro interno' });
});

// Conectar ao banco e iniciar o servidor
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Alarm service running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso.`);
        process.exit(1);
      } else {
        console.error('❌ Erro inesperado ao iniciar o servidor:', err);
      }
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });
