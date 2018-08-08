const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.get('/allusers',userController.displayAllUsers);
router.post('/login',userController.loginUser);
router.post('/signup',userController.signUpUser);
router.delete('/:userEmail',userController.deleteUserByEmail);
router.get('/:userEmail',userController.getUserByMail);

module.exports = router;