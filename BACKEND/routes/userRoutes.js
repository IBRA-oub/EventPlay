const express  = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/register',UserController.registerUser)
router.post('/login',UserController.loginUser)
router.get('/getAllUsers',UserController.getAllUser)
router.get('/findUser/:id', UserController.findUser)
router.put('/updateUser/:id', UserController.updateUser)
module.exports = router;