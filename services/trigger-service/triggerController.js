const axios = require('axios');

const ALARM_SERVICE_URL = process.env.ALARM_SERVICE_URL || 'http://localhost:3004';

const triggeredAlarm = async (req, res) => {
  const { alarmId } = req.body;

  try {
    const response = await axios.put(`${ALARM_SERVICE_URL}/alarms/trigger`, {
      alarmId
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao disparar alarme:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Erro interno ao disparar alarme'
    });
  }
};

const untriggeredAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  try {
    const response = await axios.put(`${ALARM_SERVICE_URL}/alarms/untrigger`, {
      alarmId,
      userID
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro ao desarmar alarme:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Erro interno ao desarmar alarme'
    });
  }
};

module.exports = {
  triggeredAlarm,
  untriggeredAlarm
};
