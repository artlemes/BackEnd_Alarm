const Alarm = require('./alarmModel.js');
const NotFoundError = require('../Errors/notFoundError.js');
const axios = require('axios');


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
  const { idAlarm, idUser } = req.body; // pode ajustar se vier no body

  try {
    // 1. Verifica se o alarme existe
    const alarm = await Alarm.findById(idAlarm);
    if (!alarm) {
      return res.status(404).json({ error: 'Alarme não encontrado' });
    }

    // 2. Verifica se o usuário existe no user-service
  const userServiceURL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
  console.log(`Consultando user-service: ${userServiceURL}/users/${idUser}`);

  try {
    const userResponse = await axios.get(`${userServiceURL}/users/${idUser}`);
    console.log('✅ Resposta do user-service:', userResponse.status, userResponse.data);
    userExists = true;
  } catch (err) {
    console.error('❌ Falha na requisição axios:', err.response?.status, err.message);
    return res.status(404).json({ error: 'Usuário não encontrado no user-service' });
  }

    // 3. Adiciona usuário ao alarme se ainda não estiver autorizado
    if (!alarm.authorizedUsers.includes(idUser)) {
      alarm.authorizedUsers.push(idUser);
    }

    // 4. Salva o alarme atualizado
    await alarm.save();

    res.status(200).json({ message: 'Usuário associado com sucesso', alarm });

  } catch (err) {
    next(err);
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


module.exports = { createAlarm, getAlarms, getAlarmById, deleteAlarm, associateUser };
