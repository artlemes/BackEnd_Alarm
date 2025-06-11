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

const removePermission = async (req, res) => {
  const { id } = req.params

  try {
    const alarmInQuestion = await Alarm.findById(id);
    
    if (!alarmInQuestion) {
      return res.status(404).json({ message: 'Alarme não encontrado' });
    }

    alarmInQuestion.authorizedUsers.length = 0

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
  const { alarmId, userID } = req.body 

  try {
    let alarm = await Alarm.findById(alarmId)

    if (alarm.authorizedUsers.includes(userID)) { //ver se é o usuário com permissão
      alarm.activated = true;
      await alarm.save();

      return res.status(200).json({ message: 'Alarme ativado' });
    }
    else {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }

  } catch (error) {
  console.error('Erro ao atualizar Alarme:', error);
  res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const deactivateAlarm = async (req, res) => {
  const { alarmId, userID } = req.body 

  try {
    let alarm = await Alarm.findById(alarmId)

    if (alarm.authorizedUsers.includes(userID)) { //ver se é o usuário com permissão
      alarm.activated = false
      await alarm.save();

      return res.status(200).json({ message: 'Alarme desativado' });
    }
    else {
      return res.status(401).json({ message: 'Usuário não autorizado' });
    }

  } catch (error) {
  console.error('Erro ao atualizar Alarme:', error);
  res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const triggeredAlarm = async (req, res) => {
  const { alarmId } = req.body //ver se é o usuário com permissão

  try {
    let alarm = await Alarm.findById(alarmId)

    alarm.triggered = true; //simplesmente dispara
    await alarm.save();

    return res.status(200).json({ message: 'Alarme disparado !!! PERIGO' }); // transformar isso numa notificação e num log
    
  } catch (error) {
  console.error('Erro ao atualizar Alarme:', error);
  res.status(500).json({ message: 'Erro interno ao atualizar Alarme' });
  }
};

const untriggeredAlarm = async (req, res) => {
  const { alarmId, userID } = req.body //ver se é o usuário com permissão

  try {
    let alarm = await Alarm.findById(alarmId)

    if (alarm.authorizedUsers.includes(userID)) {
      alarm.triggered = false
      alarm.activated = false
      await alarm.save();

      return res.status(200).json({ message: 'Alarme desativado' }); 
    }
    else {
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
