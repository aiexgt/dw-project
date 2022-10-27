'use strict'

const express = require('express');
const ClienteController = require('../controllers/cliente');

const router = express.Router();

router.get('/', ClienteController.read);
router.get('/:id', ClienteController.readOne);

router.post('/', ClienteController.add);

module.exports = router;