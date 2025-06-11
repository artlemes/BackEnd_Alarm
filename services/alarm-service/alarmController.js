const Alarm = require('./alarmModel.js');
const NotFoundError = require('../Errors/notFoundError.js');
const axios = require('axios');

const NOTIFY_URL = process.env.NOTIFY_URL || 'http://localhost:3007/notify';
const LOG_URL = process.env.LOG_URL || 'http://localhost:3008/logs';

const createAlarm = async (req, res, next) => {
  try {
    const newAlarm = await Alarm.create(req.body);
    res.status(201).json(newAlarm);
  } catch (err) {
    next(err);
  }
};

const getAlarms = async (req, res, next) => {
  try {
    const Alarms = await Alarm.find();
    res.json(Alarms);
  } catch (err) {
    next(err);
  }
};

const getAlarmById = async (req, res, next) => {
  try {
    const Alarm = await Alarm.findById(req.params.id);
    if (!Alarm) throw new NotFoundError('Alarm not found');
    res.json(Alarm);
  } catch (err) {
    next(err);
  }
};

const associateUser = async (req, res, next) => {
  const { idAlarm, idUser } = req.body;

  try {
    const alarm = await Alarm.findById(idAlarm);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarme não encontrado' });
    }

    const userServiceURL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
    try {
      const userResponse = await axios.get(`${userServiceURL}/users/${idUser}`);
    } catch (err) {
      return res.status(404).json({ error: 'Usuário não encontrado no user-service' });
    }

    if (!alarm.authorizedUsers.includes(idUser)) {
      alarm.authorizedUsers.push(idUser);
    }

    await alarm.save();

    res.status(200).json({ message: 'Usuário associado com sucesso', alarm });
  } catch (err) {
    next(err);
  }
};

const removePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const alarmInQuestion = await Alarm.findById(id);
    if (!alarmInQuestion) {
      return res.status(404).json({ message: 'Alarme não encontrado' });
    }

    alarmInQuestion.authorizedUsers.length = 0;
    await alarmInQuestion.save();

    res.status(200).json({ message: 'Permissões removidas!!!', alarmInQuestion });
  } catch (error) {
    console.error('Erro ao atualizar Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar o Alarme' });
  }
};

const deleteAlarm = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAlarm = await Alarm.findByIdAndDelete(id);

    if (!deletedAlarm) {
      return res.status(404).json({ message: 'Alarme não encontrado' });
    }

    res.status(200).json({ message: 'Alarme excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao excluir Alarme' });
  }
};

const activateAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  try {
    let alarm = await Alarm.findById(alarmId);

    if (alarm.authorizedUsers.includes(userID)) {
      alarm.activated = true;
      await alarm.save();

      await axios.post(NOTIFY_URL, {
        userID,
        alarmId,
        eventType:'ativado'
      });

      await axios.post(LOG_URL, {
        alarmId,
        userID,
        eventType: 'activated'
      });

      return res.status(200).json({ message: 'Alarme ativado' });
    } else {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const deactivateAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  try {
    const alarm = await Alarm.findById(alarmId);

    if (alarm.authorizedUsers.includes(userID)) {
      alarm.activated = false;
      await alarm.save();

      await axios.post(NOTIFY_URL, {
        userID,
        alarmId,
        eventType:'desativado'
      });

      await axios.post(LOG_URL, {
        alarmId,
        userID,
        eventType: 'deactivated'
      });

      return res.status(200).json({ message: 'Alarme desativado' });
    } else {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const triggeredAlarm = async (req, res) => {
  const { alarmId } = req.body;

  try {
    let alarm = await Alarm.findById(alarmId);

    if (alarm.activated) {
      alarm.triggered = true;
      await alarm.save();

      for (const userID of alarm.authorizedUsers) {
        await axios.post(NOTIFY_URL, {
          userID,
          alarmId,
          eventType:'DISPARADO!!!!!'
        });
      }

      await axios.post(LOG_URL, {
        alarmId,
        eventType: 'triggered'
      });

      return res.status(200).json({ message: 'Alarme disparado !!! PERIGO' });
    } else {
      return res.status(401).json({ message: 'Alarme desativado, não pode disparar' });
    }
  } catch (error) {
    console.error('Erro ao atualizar Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const untriggeredAlarm = async (req, res) => {
  const { alarmId, userID } = req.body;

  try {
    let alarm = await Alarm.findById(alarmId);

    if (alarm.authorizedUsers.includes(String(userID))) {
      alarm.triggered = false;
      alarm.activated = false;
      await alarm.save();

      await axios.post(NOTIFY_URL, {
        userID,
        alarmId,
        eventType:'desarmado'
      });

      await axios.post(LOG_URL, {
        alarmId,
        userID,
        eventType: 'deactivated'
      });

      return res.status(200).json({ message: 'Alarme desativado' });
    } else {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar Alarme:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

module.exports = {
  createAlarm,
  getAlarms,
  getAlarmById,
  deleteAlarm,
  associateUser,
  removePermission,
  activateAlarm,
  deactivateAlarm,
  triggeredAlarm,
  untriggeredAlarm
};
