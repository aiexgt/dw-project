'use strict'

const express = require('express');
const UsuarioController = require('../controllers/usuario');

const router = express.Router();

router.post('/login', UsuarioController.login);

router.get('/', UsuarioController.read);
router.get('/read/:id', UsuarioController.readOne);
router.get('/search', UsuarioController.search);

module.exports = router;