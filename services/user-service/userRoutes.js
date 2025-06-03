const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.post('/', userController.createUser);
router.get('/all', userController.getUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);


module.exports = router;
