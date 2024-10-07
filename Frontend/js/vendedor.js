//IMPORTANTE:PAINEL Vendedor
function showCardProdutos() {
  const cardsContainer = document.getElementById("cardProdutos");
  const produtosCarrinhos = document.getElementById("carrinhoContainer");

  produtosCarrinhos.style.display = "none";
  cardsContainer.style.display = "flex";

  cardsContainer.innerHTML = "";

  fetch("http://localhost:3000/produto/produtos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        alert("Nenhum produto cadastrado."); // Mensagem se não houver produtos
      } else {
        cardProdutos(data); // Chama a função para criar e exibir os cards
      }
    })
    .catch((error) => {
      console.error("Erro ao card produtos:", error); // Mensagem de erro no console
    });

  function cardProdutos(data) {
    cardsContainer.innerHTML = ""; // Limpa o conteúdo anterior do contêiner

    data.forEach((item) => {
      // Cria um contêiner para o card
      const card = document.createElement("div");
      card.classList.add("card"); // Adiciona uma classe para estilizar o card
      card.classList = "card";

      card.setAttribute("data-id", item._id); // Armazena o ID na linha

      // Cria e adiciona a imagem ao card
      const imgSrc = document.createElement("img");
      imgSrc.src = `http://localhost:3000/produto/produtoImg/${item._id}`; // Ajusta a URL conforme necessário
      imgSrc.alt = item.metadata.nome;
      imgSrc.classList = "card-img-top";
      card.appendChild(imgSrc);

      // Cria e adiciona o título ao card
      const nome = document.createElement("h1");
      nome.textContent = item.metadata.nome; // Usar `metadata.nome` para acessar o nome do produto
      nome.classList = "card-title";
      card.appendChild(nome);

      // Cria e adiciona o preço ao card
      const preco = document.createElement("p");
      preco.classList = "conteudo";
      preco.textContent = `Preço: ${item.metadata.preco}`;
      card.appendChild(preco);

      // Cria e adiciona a categoria ao card
      const categoria = document.createElement("p");
      preco.classList = "conteudo";
      categoria.textContent = `Categoria: ${item.metadata.categoria}`;
      card.appendChild(categoria);

      // Cria e adiciona a quantidade ao card
      const quantidade = document.createElement("p");
      preco.classList = "conteudo";
      quantidade.textContent = `Quantidade Estoque: ${item.metadata.quantidade}`;
      card.appendChild(quantidade);

      const buttonAddCarrinho = document.createElement("button");
      buttonAddCarrinho.textContent = "Add ao carrinho";
      buttonAddCarrinho.classList = "btn buttonAddCarrinho";
      buttonAddCarrinho.onclick = function () {
        const id = card.getAttribute("data-id"); // Recupera o ID da linha
        console.log("ID da linha:", id); // Recupera o ID da linha
        console.log("clicado no botão de Add ao carrinho", id);
        addProdutoCarrinho(
          id,
          item.metadata.nome,
          item.metadata.preco,
          item.metadata.categoria,
          item.metadata.quantidade,
          imgSrc.src
        ); // Passa o ID para a função de edição
      };
      card.appendChild(buttonAddCarrinho);

      // Adiciona o card ao contêiner
      cardsContainer.appendChild(card);
    });
  }
}

function addProdutoCarrinho(id, nome, preco, categoria, quantidade, imgSrc) {
  console.log("função addProdutoCarrinho");
  fetch("http://localhost:3000/carrinho/addProdutoCarrinho", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      produtoId: id,
      nome: nome,
      preco: preco,
      categoria: categoria,
      quantidade: quantidade,
      imgSrc: imgSrc,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Produto adicionado ao carrinho com sucesso:", data);
      // Atualize a interface do usuário ou faça outra ação conforme necessário
      mostrarCarrinho(); // mostrar cards do carrinho atualizados
      // AO ADD AO CARRINHO UM PRODUTO (SUBTRAI, 1 DA  QUANTIDADE DO ESTOQUE)
      fetch(`http://localhost:3000/produto/atualizarQuantidade/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantidadeVendida: 1, // Usa a quantidade fornecida
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Quantidade -1 atualizada :", data);
        })
        .catch((error) => {
          console.error("Erro ao atualizar a quantidade:", error);
        });
    })
    .catch((error) => {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    });
}

function mostrarCarrinho() {
  const produtosEstoque = document.getElementById("cardProdutos");
  const produtosCarrinhos = document.getElementById("carrinhoContainer");

  produtosEstoque.style.display = "none";
  produtosCarrinhos.style.display = "flex";

  fetch("http://localhost:3000/carrinho/produtosCarrinho", {
    // GET MOSTRA PRODUTOS NO CARRINHO
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      const carrinhoContainer = document.getElementById("carrinhoContainer");
      carrinhoContainer.innerHTML = ""; // Limpa o conteúdo anterior
      const buttonFinalizarCompra = document.createElement("button");
      buttonFinalizarCompra.textContent = "Finalizar compra";
      buttonFinalizarCompra.classList = " btn_modal";
      buttonFinalizarCompra.onclick = function () {
        finalizarCompra(data);
        console.log(data);
      };

      carrinhoContainer.appendChild(buttonFinalizarCompra);

      data.forEach((item) => {
        // Cria um contêiner para o card
        const card = document.createElement("div");
        card.classList.add("card"); // Adiciona uma classe para estilizar o card
        card.classList = "card";

        card.setAttribute("data-id", item._id); // Armazena o ID na linha

        // Cria e adiciona a imagem ao card
        const imgSrc = document.createElement("img");
        imgSrc.src = item.imgSrc; // Ajusta a URL conforme necessário
        imgSrc.alt = item.nome;
        imgSrc.classList = "card-img-top";
        card.appendChild(imgSrc);

        // Cria e adiciona o título ao card
        const nome = document.createElement("h1");
        nome.textContent = item.nome; // Usar `metadata.nome` para acessar o nome do produto
        nome.classList = "card-title";
        card.appendChild(nome);

        // Cria e adiciona o preço ao card
        const preco = document.createElement("p");
        preco.classList = "conteudo";
        preco.textContent = `Preço: ${item.preco}`;
        card.appendChild(preco);

        // Cria e adiciona a categoria ao card
        const categoria = document.createElement("p");
        preco.classList = "conteudo";
        categoria.textContent = `Categoria: ${item.categoria}`;
        card.appendChild(categoria);

        // Cria e adiciona a quantidade ao card
        const quantidadeLabel = document.createElement("label");
        quantidadeLabel.classList = "conteudo";
        quantidadeLabel.textContent = "Quantidade: ";
        card.appendChild(quantidadeLabel);

        const quantidadeInput = document.createElement("input");
        quantidadeInput.classList = "inputQtd";
        quantidadeInput.type = "number";
        quantidadeInput.min = 1;
        quantidadeInput.value = item.quantidade;
        card.appendChild(quantidadeInput);

        const buttonDelet = document.createElement("button");
        buttonDelet.textContent = "Exluir";
        buttonDelet.classList = "btn buttonDelet";
        buttonDelet.onclick = function () {
          const id = card.getAttribute("data-id"); // Recupera o ID da linha
          console.log("ID da linha:", id); // Recupera o ID da linha
          console.log("clicado no botão de excluir ao carrinho", id);
          removerProduto(id, item.nome, item.preco, item.categoria, item.quantidade, imgSrc.src); // Passa o ID para a função de edição
          //window.location.href = 'carrinho.html'
        };
        card.appendChild(buttonDelet);

        const buttonEdit = document.createElement("button");
        buttonEdit.textContent = "Editar Quantidade";
        buttonEdit.classList = "btn buttonEdit";
        buttonEdit.onclick = function () {
          const id = card.getAttribute("data-id"); // Recupera o ID da linha
          console.log("ID da linha:", id); // Recupera o ID da linha
          console.log("clicado no botão de editar ao carrinho", id);
          editarQuantidade(id, quantidadeInput.value); // Passa o ID para a função de edição
          //window.location.href = 'carrinho.html'
        };
        card.appendChild(buttonEdit);

        // Adiciona o card ao contêiner
        carrinhoContainer.appendChild(card);
      });
    });
}

function editarQuantidade(id, quantidadeAtualizada) {
  //quantidadeAtualizada recebe o valor do input quantidade
  const updatedQuantidade = parseInt(quantidadeAtualizada);

  // Atualiza a quantidade no carrinho
  fetch(`http://localhost:3000/carrinho/UpQuantidadeCarrinho/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantidade: updatedQuantidade,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro ao atualizar a quantidade no carrinho");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Quantidade no carrinho atualizada", data);
      mostrarCarrinho(); // Atualiza a visualização do carrinho
    })
    .catch((error) => {
      console.error("Erro ao editar quantidade:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    });
}

function removerProduto(id) {
  fetch(`http://localhost:3000/carrinho/removerProduto/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Produto removido", data);
      mostrarCarrinho(); // Atualize a lista após remover o item
    })
    .catch((error) => {
      console.error("Erro ao remover o produto", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    });
}

function finalizarCompra() {
  fetch(`http://localhost:3000/carrinho/produtosCarrinho`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Dados recuperados pela função finalizarCompra", data);

      // Limpa o conteúdo da tabela antes de renderizar os novos dados
      const carrinhoContainer = document.getElementById("carrinhoContainer");
      carrinhoContainer.innerHTML = "";

      // Cria a tabela
      const table = document.createElement("table");
      table.className = "table table-bordered";

      // Cabeçalho da tabela
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const headers = ["Produto", "Preço", "Quantidade", "Total Produto"];

      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Corpo da tabela (tbody)
      const tbody = document.createElement("tbody");

      let valorTotal = 0;

      // Itera sobre os produtos no carrinho e cria as linhas da tabela
      data.forEach((item) => {
        const row = document.createElement("tr");

        // Coluna do nome do produto
        const tdNome = document.createElement("td");
        tdNome.textContent = item.nome;
        row.appendChild(tdNome);

        // Coluna do preço
        const tdPreco = document.createElement("td");
        tdPreco.textContent = `R$ ${item.preco}`;
        row.appendChild(tdPreco);

        // Coluna da quantidade
        const tdQuantidade = document.createElement("td");
        tdQuantidade.textContent = item.quantidade;
        row.appendChild(tdQuantidade);

        // Coluna do total por produto
        const tdTotalProduto = document.createElement("td");
        const precoNumerico = parseFloat(item.preco.replace(",", "."));
        const valorTotalProduto = precoNumerico * item.quantidade;
        tdTotalProduto.textContent = `R$ ${valorTotalProduto.toFixed(2)}`;
        row.appendChild(tdTotalProduto);

        // Atualiza o valor total da compra
        valorTotal += valorTotalProduto;

        // Adiciona a linha ao corpo da tabela
        tbody.appendChild(row);
      });

      // Adiciona o tbody na tabela
      table.appendChild(tbody);

      // Cria uma linha para o valor total
      const totalRow = document.createElement("tr");
      const totalLabelCell = document.createElement("td");
      totalLabelCell.colSpan = 3;
      totalLabelCell.textContent = "Valor Total da Compra:";
      totalRow.appendChild(totalLabelCell);

      const totalValueCell = document.createElement("td");
      totalValueCell.textContent = `R$ ${valorTotal.toFixed(2)}`;
      totalRow.appendChild(totalValueCell);

      // Adiciona a linha do valor total ao tbody
      tbody.appendChild(totalRow);

      // Renderiza a tabela dentro do carrinhoContainer
      carrinhoContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("Erro ao finalizar a compra:", error);
      alert("Ocorreu um erro ao finalizar a compra. Tente novamente.");
    });
}
