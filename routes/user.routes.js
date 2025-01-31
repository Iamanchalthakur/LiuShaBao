const express = require('express');
const router = express.Router();
// const authController = require('../controller/auth.controller');

const { signUp, signIn } = require('../controller/auth.controller');


router.post('/signup', signUp);
router.post('/signin', signIn)


module.exports = router;
