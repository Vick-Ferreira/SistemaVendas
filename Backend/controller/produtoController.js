const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const { Readable } = require("stream");
require("dotenv").config();

const url = process.env.MONGODB_URI;

exports.createProduto = async (req, res) => {
  if (!req.file) {
    console.error("Nenhum arquivo enviado");
    return res.status(400).json({ erro: "nenhum arquivo encontrado" });
  }

  const { nome, preco, quantidade, categoria } = req.body;
  const cliente = new MongoClient(url);

  try {
    console.log("Conectando ao MongoDB...");
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db(); // Obtém o banco de dados
    const bucket = new GridFSBucket(db, { bucketName: "Produtos" }); // Substituir 'database' por 'db'

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    console.log("Iniciando upload do arquivo...");
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { nome, preco, quantidade, categoria },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      console.error("Erro ao enviar arquivo:", error);
      res.status(500).json({ erro: "erro ao enviar o arquivo" });
      cliente.close();
    });

    uploadStream.on("finish", () => {
      console.log("Arquivo enviado com sucesso");
      res.status(200).json({ message: "arquivo enviado com sucesso" });
      cliente.close();
    });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "erro ao conectar ao MongoDB" });
    cliente.close();
  }
};

exports.listarProduto = async (req, res) => {
  const cliente = new MongoClient(url);
  try {
    await cliente.connect();
    const db = cliente.db(); // Obtém o banco de dados
    const bucket = new GridFSBucket(db, { bucketName: "Produtos" });

    const array = bucket.find();
    const file = await array.toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ erro: "Nenhum arquivo encontrado" });
    }

    res.status(200).json(file);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "Erro ao conectar ao MongoDB" });
  } finally {
    cliente.close();
  }
};

/*IMPORTANTE:a resposta não pode ser um mix de JSON e binário em uma única resposta HTTP.
formato como multipart para transmitir ambos. */
exports.getIdImagem = async (req, res) => {
  const { id } = req.params; // Obtém o id da URL
  const cliente = new MongoClient(url);

  try {
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db(); // Obtém o banco de dados
    const bucket = new GridFSBucket(db, { bucketName: "Produtos" });

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    // Servindo a imagem
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    res.setHeader("Content-Type", "image/png"); // Ajuste o tipo de conteúdo conforme necessário

    // Transmite a imagem
    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", (error) => {
      console.log("Erro ao baixar arquivo", error);
      res.status(400).json({ erro: "Erro ao baixar arquivo" });
    });

    downloadStream.on("end", () => {
      res.end();
      cliente.close();
    });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "Erro ao conectar ao MongoDB" });
    cliente.close();
  }
};

exports.getIdMetadata = async (req, res) => {
  const { id } = req.params;
  const cliente = new MongoClient(url);

  try {
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db();
    const filesCollection = db.collection("Produtos.files");
    const file = await filesCollection.findOne({ _id: new ObjectId(id) });

    if (!file) {
      return res.status(404).json({ erro: "Arquivo não encontrado" });
    }

    // Extrair e retornar apenas os metadados relevantes
    const metadata = {
      nome: file.metadata.nome,
      preco: file.metadata.preco,
      quantidade: file.metadata.quantidade,
      categoria: file.metadata.categoria,
    };

    res.json(metadata);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "Erro ao conectar ao MongoDB" });
  } finally {
    cliente.close();
  }
};

//atualizando ambos os elementos
exports.updateImageAndMetadata = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade, categoria } = req.body;
  const cliente = new MongoClient(url);

  try {
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db();
    const bucket = new GridFSBucket(db, { bucketName: "Produtos" });
    const filesCollection = db.collection("Produtos.files");

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    // Atualizar a imagem
    if (req.file) {
      // Remover a imagem antiga
      await bucket.delete(new ObjectId(id));

      // Adicionando a nova imagem
      const uploadStream = bucket.openUploadStreamWithId(new ObjectId(id), req.file.originalname);
      uploadStream.end(req.file.buffer);

      uploadStream.on("error", (error) => {
        throw new Error("Erro ao atualizar a imagem");
      });
    }

    // Atualizando os metadados
    await filesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "metadata.nome": nome,
          "metadata.preco": preco,
          "metadata.quantidade": quantidade,
          "metadata.categoria": categoria,
        },
      }
    );

    res.status(200).json({ mensagem: "Imagem e metadados atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "Erro ao conectar ao MongoDB" });
  } finally {
    cliente.close();
  }
};

// AO ADD AO CARRINHO (SUBTRAI, 1 DA  QUANTIDADE DO ESTOQUE)
exports.atualizarQtd = async (req, res) => {
  console.log("função atualizarQtd");
  const produtoId = req.params.id; // ID do produto
  const cliente = new MongoClient(url);
  const quantidadeVendida = req.body.quantidadeVendida || 1; // Padrão para 1

  try {
    console.log(`Atualizando quantidade do produto com ID: ${produtoId}`);
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db();
    const filesCollection = db.collection("Produtos.files");

    // Busca o produto pelo ID
    const file = await filesCollection.findOne({ _id: new ObjectId(produtoId) });

    if (!file) {
      console.log("Produto não encontrado");
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // Verificação de quantidade disponível
    let quantidadeEmEstoque = file.metadata.quantidade;
    console.log(`Quantidade em estoque: ${quantidadeEmEstoque}`);

    if (quantidadeEmEstoque < quantidadeVendida) {
      console.log("Quantidade insuficiente em estoque");
      return res.status(400).json({ message: "Quantidade insuficiente em estoque" });
    }

    // Subtrai a quantidade vendida da quantidade em estoque
    quantidadeEmEstoque -= quantidadeVendida;

    // Atualiza a quantidade nos metadados do produto
    const resultado = await filesCollection.updateOne(
      { _id: new ObjectId(produtoId) },
      { $set: { "metadata.quantidade": quantidadeEmEstoque } }
    );

    if (resultado.modifiedCount === 0) {
      throw new Error("Falha ao atualizar a quantidade do produto");
    }

    console.log("Quantidade atualizada com sucesso");
    res
      .status(200)
      .json({ message: "Quantidade atualizada com sucesso", novaQuantidade: quantidadeEmEstoque });
  } catch (error) {
    console.error("Erro ao atualizar a quantidade:", error);
    res.status(500).json({ message: "Erro ao atualizar a quantidade", error });
  } finally {
    await cliente.close();
  }
};

//ATUALIZAR ESTOQUE AU ATUALIZAR QUANTIDADE DO PRODUTO NO CARRINHO
exports.atualizarEtq = async (produtoId, diferenca) => {
  let client;

  try {
    client = await MongoClient.connect(url);
    const db = client.db();

    // Logando o produtoId recebido
    console.log("Produto ID recebido (string):", produtoId);

    // Convertendo para ObjectId
    const objectId = new ObjectId(produtoId);
    console.log("Produto ID convertido para ObjectId:", objectId);

    // Buscar o produto no estoque
    const produto = await db.collection("Produtos.files").findOne({ _id: objectId });
    console.log("Produto encontrado:", produto);

    if (!produto || !produto.metadata) {
      throw new Error("Produto não encontrado no estoque");
    }

    const quantidadeAtualEstoque = produto.metadata.quantidade;
    const novaQuantidadeEstoque = quantidadeAtualEstoque - diferenca;

    console.log("Quantidade atual em estoque:", quantidadeAtualEstoque);
    console.log("Nova quantidade em estoque após atualização:", novaQuantidadeEstoque);

    // Verificar se a nova quantidade não é negativa
    if (novaQuantidadeEstoque < 0) {
      throw new Error("Estoque insuficiente");
    }

    // Atualiza a quantidade no estoque
    await db
      .collection("Produtos.files")
      .updateOne({ _id: objectId }, { $set: { "metadata.quantidade": novaQuantidadeEstoque } });

    console.log("Estoque atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar estoque:", error);
    throw error; // Propaga o erro
  } finally {
    if (client) {
      client.close();
    }
  }
};

exports.deleteImageAndMetadata = async (req, res) => {
  const { id } = req.params;
  const cliente = new MongoClient(url);

  try {
    await cliente.connect();
    console.log("Conexão estabelecida com sucesso ao MongoDB");

    const db = cliente.db();
    const bucket = new GridFSBucket(db, { bucketName: "Produtos" }); //binario (imagem)
    const filesCollection = db.collection("Produtos.files"); //metadados

    // Verifica se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ erro: "ID inválido" });
    }

    // Verifica se o arquivo existe
    const file = await filesCollection.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ erro: "Arquivo não encontrado" });
    }

    // Remove a imagem do GridFS
    await bucket.delete(new ObjectId(id));

    // Remove os metadados do MongoDB
    await filesCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    res.status(500).json({ erro: "Erro ao conectar ao MongoDB" });
  } finally {
    cliente.close();
  }
};
