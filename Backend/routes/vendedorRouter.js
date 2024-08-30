const express = require('express');
const controllerVendedor = require('../controller/vendedorController');

const router = express.Router();

router.post('/cadastroVendedor', controllerVendedor.createVendedor);
router.get('/vendedores', controllerVendedor.buscarVendedor);
router.get('/vendedor/:id', controllerVendedor.buscarIdVendedor);
router.patch('/vendedor/:id', controllerVendedor.updateVendedor);
router.delete('/vendedor/:id', controllerVendedor.deleteVendedor);

module.exports = router;