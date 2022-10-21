'use strict'

const express = require('express');
const PedidoController = require('../controllers/pedido');

const router = express.Router();

router.get('/', PedidoController.read);
router.get('/read/:id', PedidoController.readOne);

router.post('/', PedidoController.add);
router.put('/:id', PedidoController.update);
router.delete('/:id', PedidoController.remove);

module.exports = router;