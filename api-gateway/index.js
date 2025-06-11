const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importação de rotas por módulo
const userRoutes = require('./routes/users');
const alarmRoutes = require('./routes/alarms');
const controlRoutes = require('./routes/control');

// Registro das rotas no gateway
app.use('/users', userRoutes);
app.use('/alarms', alarmRoutes);
app.use('/control', controlRoutes);  // acionamento e disparo

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 API Gateway rodando na porta ${PORT}`);
});
