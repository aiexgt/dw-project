'use strict'

const express = require('express');
const UsuarioController = require('../controllers/usuario');

const router = express.Router();

router.get('/', UsuarioController.read);

module.exports = router;