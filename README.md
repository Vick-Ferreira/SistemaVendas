# Sistema Interno de Vendas Institucional

## Descrição

Este projeto está em desenvolvimento e visa criar um sistema interno de vendas para uma instituição. O foco principal é o backend, com a manipulação de dados sendo a prioridade. A aplicação é desenvolvida utilizando JavaScript, Node.js, Express e MongoDB.

## Funcionalidades

### Frontend

O frontend do sistema inclui:

- **Página Principal**: Tela inicial do sistema.
- **Painel de Administradores**: Área de gerenciamento para admins.
- **Painel de Vendedores**: Área de gerenciamento para vendedores.

### Backend

O backend possui as seguintes funcionalidades:

- **Painel Admin**:
  - **Adicionar**: Admins, vendedores e produtos.
  - **Editar**: Admins, vendedores e produtos.
  - **Gerenciamento de Usuários**: Admins e vendedores têm seus nomes e um número de registro cadastrado no sistema, que também corresponde à senha de acesso.
  - **Controle de Produtos**: Adição, edição e exclusão de produtos são realizadas pelo administrador. Produtos têm nome, descrição, preço, quantidade e imagem.
  
- **Painel do Vendedor**:
  - **Gerenciamento de Produtos**: Vendedores podem adicionar produtos ao carrinho do cliente, editar a quantidade e excluir produtos que estão no carrinho.
  - **Carrinho de Compras**: O vendedor pode ver o carrinho com todos os produtos, editar quantidades e excluir itens. Ao finalizar a compra, o carrinho é registrado com todos os produtos, data, hora e valor total na página de Vendas.
  - **Página Vendas**: O vendedor pode ver as suas vendas finalizadas e os carrinhos com seus respectivos produtos, data, hora e valor total do mesmo.
  - 
- **Relatórios para Administradores**:
  - **Acesso a Vendas**: Administradores podem acessar os valores de vendas e data realizados pelos vendedores.

## Tecnologias Utilizadas

- **JavaScript**: Linguagem principal para desenvolvimento.
- **Node.js**: Ambiente de execução para o backend.
- **Express**: Framework para gerenciar rotas e construir a API.
- **MongoDB**: Banco de dados NoSQL para armazenar dados.

## Instruções de Uso

Para executar o projeto localmente:

1. **Na página principal, de o comando:**
   npm start
   
