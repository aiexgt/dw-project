'use strict'

const express = require('express');
const UsuarioController = require('../controllers/usuario');

const router = express.Router();

router.post('/login', UsuarioController.login);

router.get('/', UsuarioController.read);

module.exports = router;