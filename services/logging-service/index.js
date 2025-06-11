// logging-service/index.js
const express = require('express');
const mongoose = require('mongoose');
const Log = require('./loggingModel');
const app = express();
app.use(express.json());
const loggingRoutes = require('./loggingRoutes');


mongoose.connect('mongodb://localhost:27017/logging');

app.use('/logs', loggingRoutes);
app.post('/logs', async (req, res) => {
  const { alarmId, userID, eventType } = req.body;

  if (!alarmId || !eventType) {
    return res.status(400).json({ error: 'alarmId e eventType são obrigatórios' });
  }

  try {
    const log = await Log.create({ alarmId, userID, eventType });
    return res.status(201).json(log);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar log' });
  }
});

const PORT = 3008;
app.listen(PORT, () => {
  console.log(`📘 Logging service rodando na porta ${PORT}`);
});
