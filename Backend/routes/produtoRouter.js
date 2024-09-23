const express = require("express");
const multer = require("multer");
const controllerProdutos = require("../controller/produtoController");

const router = express.Router();

//config para upload de imagens
const imgStorage = multer.memoryStorage();
const imgUpload = multer({ storage: imgStorage });

router.post("/cadastrarProdutos", imgUpload.single("imagem"), controllerProdutos.createProduto);
router.get("/produtos", controllerProdutos.listarProduto);
router.get("/produtoImg/:id", controllerProdutos.getIdImagem);
router.get("/produtoMetadados/:id", controllerProdutos.getIdMetadata);
router.patch("/produto/:id", imgUpload.single("imagem"), controllerProdutos.updateImageAndMetadata);
router.delete("/produto/:id", controllerProdutos.deleteImageAndMetadata);

router.patch("/atualizarQuantidade/:id", controllerProdutos.atualizarQtd);
router.patch("/atualizarEstoque/:id", controllerProdutos.atualizarEtq);

module.exports = router;
