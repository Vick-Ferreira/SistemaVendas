const { MongoClient, GridFSBucket, ObjectId  } = require("mongodb");
const { Readable } = require("stream");
require('dotenv').config();

const url = process.env.MONGODB_URI;

exports.createProduto = async (req, res) => {
    if (!req.file) {
        console.error('Nenhum arquivo enviado');
        return res.status(400).json({ erro: 'nenhum arquivo encontrado' });
    }

    const { nome, preco, quantidade, categoria } = req.body;
    const cliente = new MongoClient(url);

    try {
        console.log('Conectando ao MongoDB...');
        await cliente.connect();
        console.log('Conexão estabelecida com sucesso ao MongoDB');

        const db = cliente.db(); // Obtém o banco de dados
        const bucket = new GridFSBucket(db, { bucketName: 'Produtos' }); // Substituir 'database' por 'db'

        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        console.log('Iniciando upload do arquivo...');
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            metadata: { nome, preco, quantidade, categoria }
        });

        readableStream.pipe(uploadStream);

        uploadStream.on('error', (error) => {
            console.error('Erro ao enviar arquivo:', error);
            res.status(500).json({ erro: 'erro ao enviar o arquivo' });
            cliente.close();
        });

        uploadStream.on('finish', () => {
            console.log('Arquivo enviado com sucesso');
            res.status(200).json({ message: 'arquivo enviado com sucesso' });
            cliente.close();
        });
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'erro ao conectar ao MongoDB' });
        cliente.close();
    }
};

exports.listarProduto = async (req, res) => {
    const cliente = new MongoClient(url);
    try {
        await cliente.connect();
        const db = cliente.db(); // Obtém o banco de dados
        const bucket = new GridFSBucket(db, { bucketName: 'Produtos' }); 

        const array = bucket.find();
        const file = await array.toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ erro: 'Nenhum arquivo encontrado' });
        }

        res.status(200).json(file);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'Erro ao conectar ao MongoDB' });
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
        console.log('Conexão estabelecida com sucesso ao MongoDB');

        const db = cliente.db(); // Obtém o banco de dados
        const bucket = new GridFSBucket(db, { bucketName: 'Produtos' });

        // Verifica se o ID é um ObjectId válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        // Servindo a imagem
        const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    
        res.setHeader('Content-Type', 'image/png'); // Ajuste o tipo de conteúdo conforme necessário

         // Transmite a imagem
        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', (error) => {
            console.log('Erro ao baixar arquivo', error);
            res.status(400).json({ erro: 'Erro ao baixar arquivo' });
        });

        downloadStream.on('end', () => {
            res.end();
            cliente.close();
        });

    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'Erro ao conectar ao MongoDB' });
        cliente.close();
    }
};

exports.getIdMetadata = async (req, res) => {
    const { id } = req.params; 
    const cliente = new MongoClient(url);

    try {
        await cliente.connect();
        console.log('Conexão estabelecida com sucesso ao MongoDB');

        const db = cliente.db(); 
        const filesCollection = db.collection('Produtos.files');
        const file = await filesCollection.findOne({ _id: new ObjectId(id) });

        if (!file) {
            return res.status(404).json({ erro: 'Arquivo não encontrado' });
        }

        // Extrair e retornar apenas os metadados relevantes
        const metadata = {
            nome: file.metadata.nome,
            preco: file.metadata.preco,
            quantidade: file.metadata.quantidade,
            categoria: file.metadata.categoria
        };

        res.json(metadata);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'Erro ao conectar ao MongoDB' });
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
        console.log('Conexão estabelecida com sucesso ao MongoDB');

        const db = cliente.db();
        const bucket = new GridFSBucket(db, { bucketName: 'Produtos' });
        const filesCollection = db.collection('Produtos.files');

        // Verifica se o ID é um ObjectId válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        // Atualizar a imagem
        if (req.file) {
            // Remover a imagem antiga
            await bucket.delete(new ObjectId(id));

            // Adicionando a nova imagem
            const uploadStream = bucket.openUploadStreamWithId(new ObjectId(id), req.file.originalname);
            uploadStream.end(req.file.buffer);

            uploadStream.on('error', (error) => {
                throw new Error('Erro ao atualizar a imagem');
            });
        }

        // Atualizando os metadados
        await filesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { 'metadata.nome': nome, 'metadata.preco': preco, 'metadata.quantidade': quantidade, 'metadata.categoria': categoria } }
        );

        res.status(200).json({ mensagem: 'Imagem e metadados atualizados com sucesso' });
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'Erro ao conectar ao MongoDB' });
    } finally {
        cliente.close();
    }
};

exports.deleteImageAndMetadata = async (req, res) => {
    const { id } = req.params;
    const cliente = new MongoClient(url);

    try {
        await cliente.connect();
        console.log('Conexão estabelecida com sucesso ao MongoDB');

        const db = cliente.db();
        const bucket = new GridFSBucket(db, { bucketName: 'Produtos' }); //binario (imagem)
        const filesCollection = db.collection('Produtos.files'); //metadados

          // Verifica se o ID é um ObjectId válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        // Verifica se o arquivo existe
        const file = await filesCollection.findOne({ _id: new ObjectId(id) });
        if (!file) {
            return res.status(404).json({ erro: 'Arquivo não encontrado' });
        }

        // Remove a imagem do GridFS
        await bucket.delete(new ObjectId(id));

        // Remove os metadados do MongoDB
        await filesCollection.deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ erro: 'Erro ao conectar ao MongoDB' });
    } finally {
        cliente.close();
    }
};