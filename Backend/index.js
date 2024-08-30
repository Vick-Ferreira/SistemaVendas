const express = require('express') //importando arquivos do node_modules
const mongoose = require('mongoose')
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const path = require('path');
// Serve arquivos estáticos da pasta Frontend
app.use(express.static(path.join(__dirname,  'Frontend')));



const Admin = require('./routes/adminRoutes');
app.use('/admin', Admin);
const Vendedor = require('./routes/vendedorRouter');
app.use('/vendedor', Vendedor);
const Produto = require('./routes/produtoRouter');
app.use('/produto', Produto);
const Carrinho = require('./routes/carrinhoRouter');
app.use('/carrinho', Carrinho);


// Conectar com MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB', error);
    });



  // Inicialização do servidor
  app.listen(port, () => {
    console.log(`Servidor está rodando na porta: ${port}`);
  });