const mongoose = require('mongoose');

// Definindo o esquema para os dados do Administrador
const adminSchema = new mongoose.Schema({
    nome: { type: String, required: true }, //obrigatório 
    registro: { type: String, required: true }
});

// Criando o modelo a partir do esquema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
