const express = require('express');
const app = express();
app.use(express.json());

app.post('/notify', (req, res) => {
  const { alarmId, userID, eventType } = req.body;

  // Simulação da "notificação" ao celular
  console.log(`📲 Notificação para usuário ${userID}: Alarme ${alarmId} foi ${eventType}`);

  res.status(200).json({ message: 'Notificação enviada (simulada)' });
});

const PORT = 3007;
app.listen(PORT, () => {
  console.log(`📡 Notification Service rodando na porta ${PORT}`);
});
