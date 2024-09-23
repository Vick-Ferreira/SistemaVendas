const mongoose = require('mongoose');

// Definindo o esquema para os dados do Carrinho
const carrinhoSchema = new mongoose.Schema({
    produtoId: String,
    nome: String,
    preco: String,
    categoria: String,
    quantidade: Number,
    imgSrc: String
});

// Criando o modelo a partir do esquema
const Carrinho = mongoose.model('Carrinho', carrinhoSchema);

module.exports = Carrinho;
