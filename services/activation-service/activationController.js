const axios = require('axios');

const ALARM_SERVICE_URL = process.env.ALARM_SERVICE_URL || 'http://localhost:3004';

const activateAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  console.log(alarmId, userID)
  try {
    const response = await axios.put(`${ALARM_SERVICE_URL}/alarms/activate`, {
      alarmId,
      userID
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao ativar alarme:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Erro interno ao ativar alarme'
    });
  }
};

const deactivateAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  try {
    const response = await axios.put(`${ALARM_SERVICE_URL}/alarms/deactivate`, {
      alarmId,
      userID
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao desativar alarme:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Erro interno ao desativar alarme'
    });
  }
};

module.exports = {
  activateAlarm,
  deactivateAlarm
};
