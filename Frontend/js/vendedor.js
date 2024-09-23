//IMPORTANTE:PAINEL Vendedor
function showProdutos(){
    const cardsContainer = document.getElementById('cardsProdutos');
    fetch('http://localhost:3000/produto/produtos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.length === 0) {
            alert('Nenhum produto cadastrado.'); // Mensagem se não houver produtos
        } else {
            cardProdutos(data); // Chama a função para criar e exibir os cards
        }
    })
    .catch(error => {
        console.error('Erro ao card produtos:', error); // Mensagem de erro no console
    });

    function cardProdutos(data) {
        cardsContainer.innerHTML = ''; // Limpa o conteúdo anterior do contêiner

        data.forEach((item) => {
            // Cria um contêiner para o card
            const card = document.createElement('div');
            card.classList.add('card'); // Adiciona uma classe para estilizar o card

            card.setAttribute('data-id', item._id); // Armazena o ID na linha

            // Cria e adiciona o título ao card
            const nome = document.createElement('h1');
            nome.textContent = item.metadata.nome; // Usar `metadata.nome` para acessar o nome do produto
            card.appendChild(nome);

            // Cria e adiciona o preço ao card
            const preco = document.createElement('p');
            preco.textContent = `Preço: ${item.metadata.preco}`;
            card.appendChild(preco);

            // Cria e adiciona a categoria ao card
            const categoria = document.createElement('p');
            categoria.textContent = `Categoria: ${item.metadata.categoria}`;
            card.appendChild(categoria);

            // Cria e adiciona a quantidade ao card
            const quantidade = document.createElement('p');
            quantidade.textContent = `Quantidade: ${item.metadata.quantidade}`;
            card.appendChild(quantidade);

            // Cria e adiciona a imagem ao card
            const imgSrc = document.createElement('img');
            imgSrc.src = `http://localhost:3000/produto/produtoImg/${item._id}`; // Ajusta a URL conforme necessário
            imgSrc.alt = item.metadata.nome;
            imgSrc.style.maxWidth = '10%'; // Ajusta o tamanho da imagem
            imgSrc.style.height = 'auto';   // Mantém a proporção da imagem
            card.appendChild(imgSrc);


            const buttonEdit = document.createElement('button');
            buttonEdit.textContent = 'Add ao carrinho';
            buttonEdit.onclick = function(){
                const id = card.getAttribute('data-id'); // Recupera o ID da linha
                console.log('ID da linha:', id); // Recupera o ID da linha
                console.log('clicado no botão de Add ao carrinho', id);
                addProdutoCarrinho( id, item.metadata.nome, item.metadata.preco, item.metadata.categoria, item.metadata.quantidade, imgSrc.src); // Passa o ID para a função de edição
                //window.location.href = 'carrinho.html'
                
            };
            card.appendChild(buttonEdit);

            // Adiciona o card ao contêiner
            cardsContainer.appendChild(card);
        });
    }
}


function addProdutoCarrinho(id, nome, preco, categoria, quantidade, imgSrc) {
    console.log("função addProdutoCarrinho")
    fetch('http://localhost:3000/carrinho/addProdutoCarrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            produtoId: id,
            nome: nome,
            preco: preco,
            categoria: categoria,
            quantidade: quantidade,
            imgSrc: imgSrc
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Erro na requisição: ' + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        console.log('Produto adicionado ao carrinho com sucesso:', data);
        // Atualize a interface do usuário ou faça outra ação conforme necessário
        

        // AO ADD AO CARRINHO UM PRODUTO (SUBTRAI, 1 DA  QUANTIDADE DO ESTOQUE)
        fetch(`http://localhost:3000/produto/atualizarQuantidade/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantidadeVendida: 1 // Usa a quantidade fornecida
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Quantidade atualizada:', data);
        })
        .catch(error => {
            console.error('Erro ao atualizar a quantidade:', error);
        });
        showProdutos();
    })
    .catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
    });
}


