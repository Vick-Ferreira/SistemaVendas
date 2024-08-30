const express = require('express');
const controllerAdmin = require('../controller/adminController');

const router = express.Router();

router.post('/cadastroAdmin', controllerAdmin.createAdmin);
router.get('/administradores', controllerAdmin.buscarAdmin);
router.get('/administrador/:id', controllerAdmin.buscarIdAdmin);
router.patch('/administrador/:id', controllerAdmin.updateAdmin);
router.delete('/administrador/:id', controllerAdmin.deleteAdmin);

module.exports = router;