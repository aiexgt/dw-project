'use strict'

const express = require('express');
const ArticuloController = require('../controllers/articulo');

const router = express.Router();

router.get('/categoria', ArticuloController.readCategoria);
router.get('/', ArticuloController.read);
router.get('/:id', ArticuloController.readOne);

router.post('/', ArticuloController.add);
router.put('/:id', ArticuloController.update);
router.delete('/:id', ArticuloController.remove);

module.exports = router;