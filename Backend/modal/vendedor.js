const mongoose = require('mongoose');

//Schema
const vendedorSchema = new mongoose.Schema({
    nome: { type: String,  required: true },
    registro: { type: String, required: true}
});
//modelo apartir do Schema
const Vendedor = mongoose.model('Vendedor', vendedorSchema);

module.exports = Vendedor;
