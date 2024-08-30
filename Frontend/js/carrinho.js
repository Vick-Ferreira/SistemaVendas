function mostrarCarrinho() {
    fetch('http://localhost:3000/carrinho/produtosCarrinho')
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro na requisição: ' + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        const carrinhoContainer = document.getElementById('carrinhoContainer');
        carrinhoContainer.innerHTML = ''; // Limpa o conteúdo anterior

        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carrinho-item');
            itemElement.innerHTML = `
                <h2>${item.nome}</h2>
                <p>Preço: ${item.preco}</p>
                <p>Categoria: ${item.categoria}</p>
                <label for="quantity-${item._id}">Quantidade:</label>
                <input type="number" id="quantity-${item._id}" class="item-quantity" value="${item.quantidade}" min="1" style="width: 60px; text-align: center;"/>
                <button id="btn-remove-${item._id}">Remover</button>
                <button id="btn-save-${item._id}">Salvar</button>
                <img src="${item.imgSrc}" alt="${item.nome}" style="max-width: 100px;">
            `;
            carrinhoContainer.appendChild(itemElement);

            // Adicionar eventos para os botões
            document.getElementById(`btn-save-${item._id}`).onclick = function() {
                editarQuantidade(item._id);
            };

            document.getElementById(`btn-remove-${item._id}`).onclick = function() {
                removerProduto(item._id);
            };
        });
    })
    .catch(error => {
        console.error('Erro ao mostrar carrinho:', error);
    });
}

function editarQuantidade(id) {
    if (!id) {
        console.error('ID não fornecido para edição!');
        return;
    }

    const updatedQuantidade = document.getElementById(`quantity-${id}`).value;

    fetch(`http://localhost:3000/carrinho/UpQuantidadeCarrinho/${id}`, { // Inclua o ID na URL para atualizar o recurso correto
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quantidade: updatedQuantidade
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Quantidade atualizada', data);
        mostrarCarrinho(); // Chama a função para atualizar a lista
    })
    .catch(error => {
        console.error('Erro ao tentar atualizar a quantidade', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
}

function removerProduto(id) {
    fetch(`http://localhost:3000/carrinho/removerProduto/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro na requisição: ' + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        console.log('Produto removido', data);
        mostrarCarrinho(); // Atualize a lista após remover o item
    })
    .catch(error => {
        console.error('Erro ao remover o produto', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
}

// Inicializa o carrinho quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrinho();
});
