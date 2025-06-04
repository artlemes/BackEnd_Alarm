const Alarm = require('./alarmModel.js');
const NotFoundError = require('../Errors/notFoundError.js');

const createAlarm = async (req, res, next) => {
  try {
    const Alarm = await Alarm.create(req.body);
    res.status(201).json(Alarm);
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

const associateUser = async(req, res, next) => {

  const Alarm = await Alarm.findById(req.params.idAlarm);

  Alarm.autorizedUsers.append(req.idUser)
  try {
    await Alarm.create(Alarm);
    res.status(201).json(Alarm);
  } catch (err) {
    next(err);
  }
}

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


module.exports = { createAlarm, getAlarms, getAlarmById, deleteAlarm };
