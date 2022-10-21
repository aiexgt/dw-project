'use strict'

const express = require('express');
const DetallePedidoController = require('../controllers/detallePedido');

const router = express.Router();

router.get('/:id', DetallePedidoController.read);
router.post('/', DetallePedidoController.add);
router.delete('/:id', DetallePedidoController.remove);

module.exports = router;