const Carrinho = require("../modal/carrinho");
const controllerProdutos = require("./produtoController");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const url = process.env.MONGODB_URI;
//MongoClient  - sem model, direto banco MongoDB Native Driver
// Mongoose = mondel

exports.addProdutoCarrinho = async (req, res) => {
  const { produtoId, nome, preco, categoria, imgSrc } = req.body;

  try {
    console.log("Conectando ao banco de dados...");

    // Converter produtoId para ObjectId
    const objectId = new ObjectId(produtoId); // o que ta em produtoId vira um obj

    // Verifica se o produto já está no carrinho
    const itemNoCarrinho = await Carrinho.findOne({ produtoId: objectId });
    console.log("Item no carrinho:", itemNoCarrinho);

    if (itemNoCarrinho) {
      // Se o produto já está no carrinho, incrementa a quantidade
      const novaQuantidade = itemNoCarrinho.quantidade + 1;
      await Carrinho.updateOne({ produtoId: objectId }, { $set: { quantidade: novaQuantidade } });
      console.log(`Quantidade atualizada para o produto ${produtoId}: ${novaQuantidade}`);
    } else {
      // Se o produto não está no carrinho, adiciona com a quantidade 1
      await Carrinho.create({
        produtoId: objectId, // Armazenar como ObjectId
        nome,
        preco,
        categoria,
        quantidade: 1,
        imgSrc,
      });
      console.log(`Produto ${produtoId} adicionado ao carrinho.`);
    }

    res.status(200).json({ message: "Produto adicionado ao carrinho com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar produto ao carrinho:", error);
    res.status(500).json({ message: "Erro ao adicionar produto ao carrinho", error });
  }
};
exports.getProdutosCarrinho = async (req, res) => {
  try {
    console.log("Recuperando produtos do carrinho..."); // Log de início
    const produtosCarrinho = await Carrinho.find();
    console.log("Produtos do carrinho encontrados:", produtosCarrinho); // Log dos dados encontrados
    res.status(200).json(produtosCarrinho);
  } catch (error) {
    console.error("Erro ao listar produtos do carrinho:", error);
    res.status(500).json({ message: "Erro ao listar produtos do carrinho." });
  }
};

exports.upQuantidadeCarrinho = async (req, res) => {
  const id = req.params.id; // ID do item no carrinho
  const { quantidade } = req.body; // Nova quantidade

  try {
    const itemCarrinho = await Carrinho.findById(id);
    if (!itemCarrinho) {
      return res.status(404).json({ error: "Produto não encontrado no carrinho" });
    }

    const produtoId = itemCarrinho.produtoId; // ID do produto no estoque
    console.log("Produto ID no carrinho:", produtoId);

    const quantidadeAnterior = itemCarrinho.quantidade;
    itemCarrinho.quantidade = quantidade;
    await itemCarrinho.save();

    const diferenca = quantidade - quantidadeAnterior;

    console.log("Diferença de quantidade:", diferenca);

    // Aqui você garante que produtoId é um ObjectId
    await controllerProdutos.atualizarEtq(new ObjectId(produtoId), diferenca);
    console.log("Atualizar estoque foi chamada com sucesso, upQuantidadeCarrinho");
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProdutoCarrinho = async (req, res) => {
  const id = req.params.id; // ID do item no carrinho

  try {
    const itemCarrinho = await Carrinho.findById(id);
    if (!itemCarrinho) {
      return res.status(404).json({ error: "Produto não encontrado no carrinho" });
    }

    const produtoId = itemCarrinho.produtoId; // ID do produto no estoque
    console.log("Produto ID no carrinho:", produtoId);

    // Captura a quantidade que estava no carrinho
    const quantidadeAnterior = itemCarrinho.quantidade;

    // Remove o produto do carrinho
    const result = await Carrinho.deleteOne({ _id: id });

    // Verifica se o produto foi encontrado e removido
    if (result.deletedCount === 0) {
      console.log(`Produto com ID ${id} não encontrado no carrinho.`);
      return res.status(404).json({ message: "Produto não encontrado no carrinho." });
    }

    // Atualiza o estoque
    await controllerProdutos.atualizarEtq(new ObjectId(produtoId), -quantidadeAnterior); // Aumenta o estoque

    console.log(`Produto com ID ${id} removido com sucesso do carrinho.`);
    res.status(200).json({ message: "Produto removido do carrinho com sucesso." });
  } catch (error) {
    console.error("Erro ao remover produto do carrinho:", error);
    res.status(500).json({ message: "Erro ao remover produto do carrinho.", error });
  }
};
