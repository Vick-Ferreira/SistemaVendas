const Admin = require('../modal/admin');


exports.createAdmin = async (req, res) => {
    // Metadados
    const { nome, registro } = req.body;
    try {
        // Criando uma nova instância do modelo Admin
        const newAdmin = new Admin({ nome, registro });

        // Salvando o documento na coleção
        const result = await newAdmin.save();

        console.log('Dados inseridos com sucesso:', result._id);
        res.status(200).json({ message: 'Dados inseridos com sucesso', id: result._id });
    } catch (error) {
        console.error('Erro ao conectar ao Mongo', error);
        res.status(500).json({ erro: 'Erro ao conectar ao Mongo' });
    }
};

exports.buscarAdmin = async (req, res) => {
    try{
        //listagem todos
        const admin = await Admin.find();
        res.status(200).json(admin)
    }catch (error) {
        res.status(500).json({json: error});
    }
}

exports.buscarIdAdmin = async (req, res) => {
    const id = req.params.id // id na url
    try{
        const admin = await Admin.findOne({_id: id})
        res.status(200).json(admin)
    }catch (error){
        res.status(500).json({error: error})
    }
}

exports.updateAdmin = async (req, res) => { 
    const id = req.params.id;

    const { nome, registro } = req.body;

    const admin = {
        nome, 
        registro
    }

    try{
        const updateAdmin = await Admin.updateOne({_id: id}, admin)
        res.status(200).json({ admin })
    }catch(error){
        res.status(500).json({error: error})
    }
}

exports.deleteAdmin = async (req, res) => {
    const id = req.params.id

    try{
        await Admin.deleteOne({_id: id})
        res.status(200).json({message: 'Admin excluido com sucesso!'});
    }catch (error){
        res.status(500).json({error: error});

    }
}