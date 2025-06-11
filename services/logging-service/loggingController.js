const Log = require('./loggingModel')
const axios = require('axios');


const getAllLogs = async(req, res) => {
    try {
        const logs = await Log.find();
        res.json(logs);
      } catch (err) {
        next(err);
      }
};


module.exports = { getAllLogs }