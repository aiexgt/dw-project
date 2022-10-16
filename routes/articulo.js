'use strict'

const express = require('express');
const ArticuloController = require('../controllers/articulo');

const router = express.Router();

router.get('/', ArticuloController.read);
router.get('/read/:id', ArticuloController.readOne);

router.post('/', ArticuloController.add);
router.put('/:id', ArticuloController.update);
router.delete('/:id', ArticuloController.remove);

module.exports = router;