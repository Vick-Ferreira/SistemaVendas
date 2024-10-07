const Vendedor = require("../modal/vendedor");

exports.createVendedor = async (req, res) => {
  const { nome, registro } = req.body;

  try {
    const newVendedor = new Vendedor({ nome, registro });

    const result = await newVendedor.save();

    console.log("dados inserido com sucesso:", result._id);
    res.status(200).json({ message: "Dados inseridos com sucesso", id: result._id });
  } catch (error) {
    console.error("Erro ao conectar ao monto", error);
    res.status(500).json({ erro: "Erro ao conectar ao mongo" });
  }
};

exports.createVendasFinalizadas = async (req, res) => {
  const { nome, preco, quantidade, totalProduto } = req.body;
  try {
    const vendasFinalizadas = new Vendas({ nome, preco, quantidade, totalProduto });
    const result = await vendasFinalizadas.save();

    console.log("dados inserido com sucesso:", result._id);
    res.status(200).json({ message: "Dados inseridos com sucesso", id: result._id });
  } catch (error) {
    console.error("Erro ao conectar ao monto", error);
    res.status(500).json({ erro: "Erro ao conectar ao mongo" });
  }
};

exports.getvendasFinalizadas = async (req, res) => {
  try {
    console.log("Recuperando vendas finalizadas...");
    const vendasFinalizadas = await Vendas.find();
    console.log("Vendas finalizadas encontradas:", vendasFinalizadas);
    res.status(200).json(vendasFinalizadas);
  } catch (error) {
    console.error("Erro ao listar vendas finalizadas:", error);
    res.status(500).json({ message: "Erro ao listar vendas finalizadas." });
  }
};

exports.buscarVendedor = async (req, res) => {
  try {
    const vendedor = await Vendedor.find();
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ json: error });
  }
};

exports.buscarIdVendedor = async (req, res) => {
  const id = req.params.id;
  try {
    const vendedor = await Vendedor.findOne({ _id: id });
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.updateVendedor = async (req, res) => {
  const id = req.params.id;

  const { nome, registro } = req.body;

  const vendedor = {
    nome,
    registro,
  };

  try {
    const updateVendedor = await Vendedor.updateOne({ _id: id }, vendedor);
    res.status(200).json({ vendedor });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteVendedor = async (req, res) => {
  const id = req.params.id;

  try {
    await Vendedor.deleteOne({ _id: id });
    res.status(200).json({ message: "Admin excluido com sucesso!" });
  } catch {
    res.status(500).json({ error: error });
  }
};
