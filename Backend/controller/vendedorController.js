const Vendedor = require('../modal/vendedor');

exports.createVendedor = async (req, res) => {
    const { nome, registro } = req.body;

    try{
        const newVendedor = new Vendedor({ nome, registro });

        const result = await newVendedor.save();

        console.log('dados inserido com sucesso:', result._id);
        res.status(200).json({ message: 'Dados inseridos com sucesso', id: result._id});
    }catch (error) {
        console.error('Erro ao conectar ao monto', error);
        res.status(500).json({erro: 'Erro ao conectar ao mongo'});
    }
};

exports.buscarVendedor = async (req, res) => {
    try{
        const vendedor = await Vendedor.find();
        res.status(200).json(vendedor);
    }catch (error){
        res.status(500).json({json: error});
    }
}

exports.buscarIdVendedor = async (req, res) => {
    const id = req.params.id;
    try{
        const vendedor = await Vendedor.findOne({_id: id});
        res.status(200).json(vendedor);
    }catch (error){
        res.status(500).json({error: error})
    }
}

exports.updateVendedor = async (req, res) => {
    const id  = req.params.id;

    const { nome, registro } = req.body;

    const vendedor = {
        nome,
        registro
    }

    try{
        const updateVendedor = await Vendedor.updateOne({_id: id}, vendedor);
        res.status(200).json({vendedor});
    }
        catch(error){
            res.status(500).json({error: error})
        }
    }

exports.deleteVendedor = async (req, res) => {
    const id = req.params.id

    try{
        await Vendedor.deleteOne({_id: id})
        res.status(200).json({message: 'Admin excluido com sucesso!'})
    }catch{
        res.status(500).json({error: error});
    }
}