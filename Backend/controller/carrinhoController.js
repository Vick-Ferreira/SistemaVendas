const Carrinho = require('../modal/carrinho');
const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGODB_URI;



exports.addProduto = async (req, res) => {
    const { produtoId, nome, preco, categoria, quantidade, imgSrc } = req.body;
    try {
        // Adiciona o produto ao carrinho
        const produto = new Carrinho({
            produtoId,
            nome,
            preco,
            categoria,
            quantidade,
            imgSrc
        });

        await produto.save();
        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
        res.status(500).json({ erro: 'Erro ao adicionar produto ao carrinho' });
    }
};

exports.getProdutosCarrinho = async (req, res) => {
    try {
        // Recupera todos os produtos do carrinho
        const produtosCarrinho = await Carrinho.find();
        res.status(200).json(produtosCarrinho);
    } catch (error) {
        console.error('Erro ao listar produtos do carrinho:', error);
        res.status(500).json({ message: 'Erro ao listar produtos do carrinho.' });
    }
};

exports.upQuantidadeCarrinho = async (req, res) => {
    const id = req.params.id; // Corrigido para req.params

    const { quantidade } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const updateQuantidade = await Carrinho.updateOne(
            { _id: id },
            { $set: { quantidade: quantidade } }
        );

        if (updateQuantidade.nModified === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Quantidade atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProdutoCarrinho = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await Carrinho.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto excluído com sucesso do carrinho!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};