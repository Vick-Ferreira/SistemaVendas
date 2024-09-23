const express = require('express');
const router = express.Router();
const carrinhoController = require('../controller/carrinhoController');


// Rota para adicionar um produto ao carrinho
router.post('/addProdutoCarrinho', carrinhoController.addProdutoCarrinho);
router.get('/produtosCarrinho', carrinhoController.getProdutosCarrinho);
router.patch('/UpQuantidadeCarrinho/:id', carrinhoController.upQuantidadeCarrinho);
router.delete('/removerProduto/:id', carrinhoController.deleteProdutoCarrinho);


module.exports = router;
