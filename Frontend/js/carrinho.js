function mostrarCarrinho() {
  fetch("http://localhost:3000/carrinho/produtosCarrinho", {
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

      data.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("carrinho-item");
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
        document.getElementById(`btn-save-${item._id}`).onclick = function () {
          editarQuantidade(item._id);
        };

        document.getElementById(`btn-remove-${item._id}`).onclick = function () {
          removerProduto(item._id);
        };
      });
    })
    .catch((error) => {
      console.error("Erro ao mostrar carrinho:", error);
    });
}

function editarQuantidade(id) {
  const updatedQuantidade = parseInt(document.getElementById(`quantity-${id}`).value);

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

function finalizarCompra(id) {
  fetch(`http://localhost:3000/carrinho/produtosCarrinho`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("dados recuperado pela função finalizarCompra", data);
      let valorTotal = 0;
      //acessar elementos de cada produto
      data.forEach((data) => {
        const IdProdCarrinho = data._id;
        const preco = data.preco;
        const quantidade = data.quantidade;
        console.log(`Produto ID: ${IdProdCarrinho}, Preço: ${preco}, Quantidade: ${quantidade}`);
        // Substitui a vírgula por ponto e converte para float
        const valorTotalProduto = parseFloat(preco.replace(",", ".")) * parseInt(quantidade);
        console.log(valorTotalProduto);
        valorTotal += valorTotalProduto; //recebe e aguar o proximo para somar
      });
      console.log(`Valor total da compra: R$ ${valorTotal.toFixed(2)}`);
    });
}

// Inicializa o carrinho quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrinho();
});
