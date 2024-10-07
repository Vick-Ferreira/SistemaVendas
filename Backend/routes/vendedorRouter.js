const express = require("express");
const controllerVendedor = require("../controller/vendedorController");

const router = express.Router();

router.post("/cadastroVendedor", controllerVendedor.createVendedor);

router.post("/vendasFinalizadas", controllerVendedor.createVendasFinalizadas);
router.get("/vendasFinalizadas", controllerVendedor.getvendasFinalizadas);

router.get("/vendedores", controllerVendedor.buscarVendedor);
router.get("/vendedor/:id", controllerVendedor.buscarIdVendedor);
router.patch("/vendedor/:id", controllerVendedor.updateVendedor);
router.delete("/vendedor/:id", controllerVendedor.deleteVendedor);

module.exports = router;
