//IMPORTANTE:PAINEL Administrador
//validação login
function validacaoAdm() {
  const nome = document.getElementById("formNomeLoginAdm").value;
  const registro = document.getElementById("formRegistroLoginAdm").value;

  fetch("http://localhost:3000/admin/administradores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].nome === nome && data[i].registro === registro) {
          alert("Login bem-sucedido!");
          window.location.href = "html/admin.html";
          return; // Pare a função para evitar múltiplos alerts
        }
      }
      alert("Usuário inválido, tente novamente!");
      // Limpar campos de entrada manualmente
      document.getElementById("formNomeLoginAdm").value = "";
      document.getElementById("formRegistroLoginAdm").value = "";
    })
    .catch((error) => {
      console.error("Erro ao tentar fazer login:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    });
}

function validacaoVend() {
  const nome = document.getElementById("formNomeLoginVend").value;
  const registro = document.getElementById("formRegistroLoginVend").value;

  fetch("http://localhost:3000/vendedor/vendedores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].nome === nome && data[i].registro === registro) {
          alert("Login bem-sucedido!");
          window.location.href = "html/vendedor.html";
          return; // Pare a função para evitar múltiplos alerts
        }
      }
      alert("Usuário inválido, tente novamente!");
      // Limpar campos de entrada manualmente
      document.getElementById("formNomeLoginVend").reset();
      document.getElementById("formRegistroLoginVend").reset();
    })
    .catch((error) => {
      console.error("Erro ao tentar fazer login:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    });
}

//post
function cadastroAdministrador() {
  fetch("http://localhost:3000/admin/cadastroAdmin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: document.getElementById("adminNome").value,
      registro: document.getElementById("adminRegistro").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Administrador adicionado!");

      // Limpar campos de entrada manualmente
      document.getElementById("adminNome").value = "";
      document.getElementById("adminRegistro").value = "";

      showListAdmin(); // Atualiza a tabela de administradores
      tabelaVisibilidade("containerAdmin"); //chamar elemento e ver vizibilidade
    })
    .catch((error) => {
      console.error("Erro ao adicionar administrador:", error);
    });
}

function cadastroVendedor() {
  fetch("http://localhost:3000/vendedor/cadastroVendedor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: document.getElementById("vendedorNome").value,
      registro: document.getElementById("vendedorRegistro").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Vendedor adicionado!"); // Adicionado com sucesso
      console.log(data); // Verificar a resposta do servidor no console

      // Limpar campos de entrada manualmente
      document.getElementById("vendedorNome").value = "";
      document.getElementById("vendedorRegistro").value = "";

      showListVendedor(); // Atualiza a tabela de vendedor
      tabelaVisibilidade("containerVendedor"); //chamar elemento e ver vizibilidade
    })
    .catch((error) => {
      console.error("Erro ao adicionar vendedor:", error);
    });
}

function cadastroProduto() {
  // Captura os valores dos inputs do formulário
  const nome = document.getElementById("produtoTitulo").value.trim();
  const preco = document.getElementById("produtoPreco").value.trim();
  const quantidade = document.getElementById("produtoQuantidade").value;
  const imgInput = document.getElementById("imgProduto");

  // Verifica se um arquivo foi selecionado
  if (!imgInput || imgInput.files.length === 0) {
    alert("Por favor, selecione uma imagem para o produto!");
    return;
  }

  const imagem = imgInput.files[0];

  // Seleciona a categoria com base no rádio selecionado
  let categoria;
  const radios = document.getElementsByName("exampleRadios");
  for (const radio of radios) {
    if (radio.checked) {
      categoria = radio.nextElementSibling.textContent.toLowerCase(); // Converte para minúsculas
      break;
    }
  }

  // Verifica se todos os campos foram preenchidos
  if (!nome || !preco || !quantidade || !categoria) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Cria um objeto FormData para enviar o arquivo e os metadados
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("preco", preco);
  formData.append("quantidade", quantidade);
  formData.append("categoria", categoria);
  formData.append("imagem", document.getElementById("imgProduto").files[0]);

  fetch("http://localhost:3000/produto/cadastrarProdutos", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Produto cadastrado com sucesso:", data);
      // Limpa o formulário após o envio
      document.getElementById("formProduto").reset();

      showCardProdutos();
    })
    .catch((error) => {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    });
}

//visibilidade FORM  - adm, vendedor
function showForm(formId) {
  const forms = document.querySelectorAll(".form");
  const pgInicio = document.getElementById("pg-abertura");
  const tables = document.querySelectorAll(".containerTable");
  const cardContainer = document.getElementById("cardProdutos");

  forms.forEach(function (form) {
    form.style.display = "none";
  });

  tables.forEach(function (table) {
    table.style.display = "none";
  });

  if (cardContainer) {
    cardContainer.style.display = "none";
  }

  // Mostrar elemento clicado
  var formToShow = document.getElementById(formId);
  if (formToShow) {
    formToShow.style.display = "block"; // Exibe o formulário desejado
    pgInicio.style.display = "none"; // Oculta a tela principal
    cardContainer.style.display = "none";
  } else {
    pgInicio.style.display = "block"; // Exibe a tela principal se nenhum formulário for encontrado
  }
}

let adminTableLoaded = false;
let vendedorTableLoaded = false;

//controla vizibilidade direfente dos container
function tabelaVisibilidade(id) {
  const adminContainer = document.getElementById("containerAdmin");
  const vendedorContainer = document.getElementById("containerVendedor");
  const cardContainer = document.getElementById("cardProdutos");
  var forms = document.querySelectorAll(".form");

  // Ocultar ambos os containers antes de exibir o correto
  adminContainer.style.display = "none";
  vendedorContainer.style.display = "none";
  cardContainer.style.display = "none";

  forms.forEach(function (form) {
    form.style.display = "none";
  });

  if (forms)
    if (id === "containerAdmin") {
      // Mostrar a tabela de administradores
      if (!adminTableLoaded) {
        showListAdmin(); // Carregar os dados apenas na primeira vez
        adminTableLoaded = true;
      }
      adminContainer.style.display = "block"; // Exibir tabela de administradores
    } else if (id === "containerVendedor") {
      // Mostrar a tabela de vendedores
      if (!vendedorTableLoaded) {
        showListVendedor(); // Carregar os dados apenas na primeira vez
        vendedorTableLoaded = true;
      }
      vendedorContainer.style.display = "block"; // Exibir tabela de vendedores
    }
}

//get
function showListAdmin() {
  const table = document.getElementById("tableAdmin");
  table.innerHTML = ""; //limpar a tabela antes de renderizar a nova lista

  //criando cabeçalho para a tabela
  const thead = document.createElement("thead"); //pai cabeçalho
  const headerLinha = document.createElement("tr"); //filho recebe th
  //definir cabeçalho
  const headers = ["Nome", "Registro", "Ações"];
  headers.forEach((headersText) => {
    //passará em cada string e atribui o texto na th
    const th = document.createElement("th");
    th.textContent = headersText;
    headerLinha.appendChild(th); //entra em tr
  });

  thead.appendChild(headerLinha); //tr entra no thead
  table.appendChild(thead); // thead entra na table (cabeçalho da minha tabela)

  //corpo tabelo
  const tbody = document.createElement("tbody");
  table.appendChild(tbody); //tbody entra na tabela

  //table = {thead = tr = th} &&  table = {tbody = tr = th1row = td}

  fetch("http://localhost:3000/admin/administradores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        alert("Nenhum administrador cadastrado.");
      } else {
        listaAdministradores(data); // Chama a função após receber os dados
      }
    })

    .catch((error) => {
      console.error("Erro ao listar administrador:", error);
    });

  function listaAdministradores(data) {
    // Limpar a tabela antes de adicionar novos dados
    tbody.innerHTML = "";

    data.forEach((item) => {
      const linha = document.createElement("tr"); // Cria uma nova linha para cada administrador

      // Adicionar o ID à linha como um atributo data-id
      linha.setAttribute("data-id", item._id); // Armazena o ID na linha

      const tdName = document.createElement("td"); // Cria uma célula para o nome
      tdName.textContent = item.nome; // Define o texto da célula como o nome
      tdName.className = "tdName";
      linha.appendChild(tdName); // Adiciona a célula à linha

      const tdRegistro = document.createElement("td"); // Cria uma célula para o registro
      tdRegistro.textContent = item.registro; // Define o texto da célula como o registro
      tdRegistro.className = "tdRegistro";
      linha.appendChild(tdRegistro); // Adiciona a célula à linha

      const tdActions = document.createElement("td");
      const buttonEdit = document.createElement("button");
      buttonEdit.textContent = "Editar";
      buttonEdit.className = "btn buttonEdit";
      buttonEdit.onclick = function () {
        const id = linha.getAttribute("data-id"); // Recupera o ID da linha
        console.log("ID da linha:", id); // Recupera o ID da linha
        console.log("Editando", id);
        editarAdm(id, item.nome, item.registro); // Passa o ID para a função de edição
      };
      linha.appendChild(buttonEdit);

      const buttonDelet = document.createElement("button");
      buttonDelet.textContent = "Excluir";
      buttonDelet.className = "btn buttonDelet";
      buttonDelet.onclick = function () {
        const id = linha.getAttribute("data-id"); // Recupera o ID da linha
        deletAdm(id); // Passa o ID para a função de exclusão
      };
      //add botões dentro da td
      tdActions.appendChild(buttonEdit);
      tdActions.appendChild(buttonDelet);
      linha.appendChild(tdActions);

      tbody.appendChild(linha); // Adiciona a linha à tabela
    });
  }
}

function showListVendedor() {
  const table = document.getElementById("tableVendedor");
  table.innerHTML = "";

  //criando cabeçalho para a tabela
  const thead = document.createElement("thead"); //pai cabeçalho
  const headerLinha = document.createElement("tr"); //filho recebe th
  //definir cabeçalho
  const headers = ["Nome", "Registro", "Ações"];
  headers.forEach((headersText) => {
    //passará em cada string e atribui o texto na th
    const th = document.createElement("th");
    th.textContent = headersText;
    headerLinha.appendChild(th); //entra em tr
  });

  thead.appendChild(headerLinha); //tr entra no thead
  table.appendChild(thead); // thead entra na table (cabeçalho da minha tabela)

  //corpo tabelo
  const tbody = document.createElement("tbody");
  table.appendChild(tbody); //tbody entra na tabela

  //table = {thead = tr = th} &&  table = {tbody = tr = th1row = td}

  fetch("http://localhost:3000/vendedor/vendedores", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        alert("Nenhum vendedor cadastrado.");
      } else {
        listaVendedores(data); // Chama a função após receber os dados
      }
    })
    .catch((error) => {
      console.error("Erro ao listar vendedor:", error);
    });

  function listaVendedores(data) {
    tbody.innerHTML = ""; // Limpar a tabela

    data.forEach((item) => {
      const linha = document.createElement("tr");
      linha.className = "linha";

      // Adicionar o ID à linha como um atributo data-id
      linha.setAttribute("data-id", item._id); // Armazena o ID na linha

      const tdName = document.createElement("td");
      tdName.textContent = item.nome;
      tdName.className = "tdName";
      linha.appendChild(tdName);

      const tdRegistro = document.createElement("td");
      tdRegistro.textContent = item.registro;
      tdRegistro.className = "tdRegistro";
      linha.appendChild(tdRegistro);

      const tdActions = document.createElement("td");
      const buttonEdit = document.createElement("button");
      buttonEdit.textContent = "Editar";
      buttonEdit.className = "btn buttonEdit";
      buttonEdit.onclick = function () {
        const id = linha.getAttribute("data-id");
        editarVend(id, item.nome, item.registro);
      };
      linha.appendChild(buttonEdit);

      const buttonDelet = document.createElement("button");
      buttonDelet.textContent = "Excluir";
      buttonDelet.className = "btn buttonDelet";

      buttonDelet.onclick = function () {
        const id = linha.getAttribute("data-id");
        deletVend(id);
      };

      tdActions.appendChild(buttonEdit);
      tdActions.appendChild(buttonDelet);
      linha.appendChild(tdActions);

      tbody.appendChild(linha);
    });
  }
}

function showCardProdutos() {
  const cardContainer = document.getElementById("cardProdutos"); // Obtém o contêiner onde os cards serão exibidos
  const forms = document.querySelectorAll(".form");
  const blocoForm = document.querySelector(".blocoForm");
  var tables = document.querySelectorAll(".containerTable");

  cardContainer.style.display = "flex";

  tables.forEach(function (table) {
    table.style.display = "none";
  });

  forms.forEach(function (form) {
    form.style.display = "none";
  });

  // Faz uma solicitação GET para obter os produtos
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
        listarcardProdutos(data); // Chama a função para criar e exibir os cards
      }
    })
    .catch((error) => {
      console.error("Erro ao listar produtos:", error); // Mensagem de erro no console
    });

  function listarcardProdutos(data) {
    cardContainer.innerHTML = ""; // Limpa o conteúdo anterior do contêiner

    data.forEach((item) => {
      // Cria um contêiner para o card
      const card = document.createElement("div");
      card.classList.add("card"); // Adiciona uma classe para estilizar o card
      card.classList = "card";

      card.setAttribute("data-id", item._id); // Armazena o ID na linha

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
      categoria.classList = "conteudo";
      categoria.textContent = `Categoria: ${item.metadata.categoria}`;
      card.appendChild(categoria);

      // Cria e adiciona a quantidade ao card
      const quantidade = document.createElement("p");
      quantidade.classList = "conteudo";
      quantidade.textContent = `Quantidade: ${item.metadata.quantidade}`;
      card.appendChild(quantidade);

      // Cria e adiciona a imagem ao card
      const imgSrc = document.createElement("img");
      imgSrc.src = `http://localhost:3000/produto/produtoImg/${item._id}`; // Ajusta a URL conforme necessário
      imgSrc.alt = item.metadata.nome;
      imgSrc.classList = "card-img-top";

      card.appendChild(imgSrc);

      const buttonEdit = document.createElement("button");
      buttonEdit.textContent = "Editar";
      buttonEdit.classList = "btn buttonEdit";
      buttonEdit.onclick = function () {
        const id = card.getAttribute("data-id"); // Recupera o ID da linha
        console.log("ID da linha:", id); // Recupera o ID da linha
        console.log("Editando", id);
        editProduto(
          id,
          item.metadata.nome,
          item.metadata.preco,
          item.metadata.categoria,
          item.metadata.quantidade,
          imgSrc.src
        ); // Passa o ID para a função de edição
      };
      card.appendChild(buttonEdit);

      const buttonDelet = document.createElement("button");
      buttonDelet.textContent = "Excluir";
      buttonDelet.classList = "btn buttonDelet";
      buttonDelet.onclick = function () {
        const id = card.getAttribute("data-id"); // Recupera o ID da linha
        deletProduto(id); // Passa o ID para a função de exclusão
      };
      card.appendChild(buttonDelet);
      // Adiciona o card ao contêiner
      cardContainer.appendChild(card);
    });
  }
}

//editar IMPORTANTE: ATUALIZAÇÃO PRECISA DE PARAMENTROS
function editarAdm(id, nome, registro) {
  if (!id) {
    console.error("ID não fornecido para edição! APOS ALTERAÇÃO");
    return;
  }

  // Definir os valores dos campos do formulário de edição
  document.getElementById("updatedAdmName").value = nome;
  document.getElementById("updatedRegistro").value = registro;

  // Ocultar a tabela e mostrar o formulário de edição
  document.getElementById("updatedAdm").style.display = "block";
  document.getElementById("tableAdmin").style.display = "none"; // Supondo que 'tableAdmin' é a ID da tabela

  // Adicionar um evento para o botão de salvar alterações
  document.getElementById("saveUpdated").onclick = function () {
    const updatedNome = document.getElementById("updatedAdmName").value;
    const updatedRegistro = document.getElementById("updatedRegistro").value;

    fetch(`http://localhost:3000/admin/administrador/${id}`, {
      // Inclua o ID na URL para atualizar o recurso correto
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: updatedNome,
        registro: updatedRegistro,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Administrador atualizado", data);
        // Mostrar a tabela e ocultar o formulário novamente
        document.getElementById("updatedAdm").style.display = "none";
        document.getElementById("tableAdmin").style.display = "block"; // Mostrar a tabela

        // Atualizar a lista de administradores
        showListAdmin(); // Chama a função para atualizar a lista
      })
      .catch((error) => {
        console.error("Erro ao tentar atualizar o administrador", error);
        alert("Ocorreu um erro. Tente novamente mais tarde.");
      });
  };

  // Adicionar um evento para o botão de cancelar
  document.getElementById("cancelUpdated").onclick = function () {
    // Mostrar a tabela e ocultar o formulário de edição
    document.getElementById("updatedAdm").style.display = "none";
    document.getElementById("tableAdmin").style.display = "block";
  };
}

function editarVend(id, nome, registro) {
  if (!id) {
    console.error("ID não fornecido para edição! APOS ALTERAÇÃO");
    return;
  }

  // Definir os valores dos campos do formulário de edição
  document.getElementById("updatedVendedorName").value = nome;
  document.getElementById("updatedRegistroVend").value = registro;

  // Ocultar a tabela e mostrar o formulário de edição
  document.getElementById("updatedVend").style.display = "block";
  document.getElementById("tableVendedor").style.display = "none"; // Supondo que 'tableAdmin' é a ID da tabela

  // Adicionar um evento para o botão de salvar alterações
  document.getElementById("saveUpdatedVend").onclick = function () {
    const updatedNomeVend = document.getElementById("updatedVendedorName").value;
    const updatedRegistroVend = document.getElementById("updatedRegistroVend").value;

    fetch(`http://localhost:3000/vendedor/vendedor/${id}`, {
      // Inclua o ID na URL para atualizar o recurso correto
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: updatedNomeVend,
        registro: updatedRegistroVend,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Vendedor atualizado", data);
        // Mostrar a tabela e ocultar o formulário novamente
        document.getElementById("updatedVend").style.display = "none";
        document.getElementById("tableVendedor").style.display = "block"; // Mostrar a tabela

        // Atualizar a lista de administradores
        showListVendedor(); // Chama a função para atualizar a lista
      })
      .catch((error) => {
        console.error("Erro ao tentar atualizar o administrador", error);
        alert("Ocorreu um erro. Tente novamente mais tarde.");
      });
  };

  // Adicionar um evento para o botão de cancelar
  document.getElementById("cancelUpdatedVend").onclick = function () {
    // Mostrar a tabela e ocultar o formulário de edição
    document.getElementById("updatedVend").style.display = "none";
    document.getElementById("tableVendedor").style.display = "block";
  };
}

function editProduto(id, nome, preco, categoria, quantidade, imgSrc) {
  console.log(`Editando produto ID: ${id}`, { nome, preco, categoria, quantidade });
  console.log("clicado botão de editar, chamou editProduto");

  // Preencher os campos com os valores recebidos
  document.getElementById("produtoUpNome").value = nome;
  document.getElementById("produtoUpPreco").value = preco;
  document.getElementById("produtoUpQuantidade").value = quantidade;

  // Definir o botão de rádio com base na categoria
  const radios = document.getElementsByName("exampleRadiosUp");
  radios.forEach((radio) => {
    if (radio.value === categoria) {
      radio.checked = true;
    }
  });

  console.log(imgSrc);

  // Exibir a imagem no formulário de edição
  const img = document.getElementById("upImgProduto");
  img.src = imgSrc; // Define a URL da imagem
  img.alt = nome;

  // Exibir o formulário de edição e ocultar a lista de produtos
  document.getElementById("updatedProduto").style.display = "block";
  document.getElementById("cardProdutos").style.display = "none";

  // Adicionar evento ao botão de salvar
  document.getElementById("salvarUpProduto").onclick = function () {
    console.log("Botão de salvar clicado.");

    const updatedNome = document.getElementById("produtoUpNome").value;
    const updatedPreco = document.getElementById("produtoUpPreco").value;
    const updatedQuantidade = document.getElementById("produtoUpQuantidade").value;

    let updatedCategoria;
    radios.forEach((radio) => {
      if (radio.checked) {
        updatedCategoria = radio.value; // Recuperar o valor do botão de rádio
      }
    });

    const updatedImg = document.getElementById("imgUpProduto").files[0];

    const formData = new FormData();
    formData.append("nome", updatedNome);
    formData.append("preco", updatedPreco);
    formData.append("quantidade", updatedQuantidade);
    formData.append("categoria", updatedCategoria);

    if (updatedImg) {
      formData.append("imagem", updatedImg);
    }

    // Adicionar logs para verificar o conteúdo do FormData
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}: ${value}`);
    }

    // Atualizar apenas os metadados
    fetch(`http://localhost:3000/produto/produto/${id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Produto atualizado", data);
        // Atualizar a lista de produtos e mostrar a tabela
        showCardProdutos();
        document.getElementById("updatedProduto").style.display = "none";
        document.getElementById("cardProdutos").style.display = "block";
      })
      .catch((error) => {
        console.error("Erro ao tentar atualizar o produto", error);
        alert("Erro ao tentar atualizar o produto. Tente novamente mais tarde.");
      });
  };
}

//excluir
function deletAdm(id) {
  fetch(`http://localhost:3000/admin/administrador/${id}`, {
    // Inclua o ID na URL para atualizar o recurso correto
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro ao excluir o administrador");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Administrador EXCLUIDO", data);
      // Aqui você pode chamar uma função para atualizar a lista após a exclusão
      showListAdmin();
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function deletVend(id) {
  fetch(`http://localhost:3000/vendedor/vendedor/${id}`, {
    // Inclua o ID na URL para atualizar o recurso correto
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro ao excluir o vendedor");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Vendedor EXCLUIDO", data);
      // Aqui você pode chamar uma função para atualizar a lista após a exclusão
      showListVendedor();
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function deletProduto(id) {
  fetch(`http://localhost:3000/produto/produto/${id}`, {
    // Inclua o ID na URL para atualizar o recurso correto
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erro ao excluir o Produto");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Produto EXCLUIDO", data);
      // Aqui você pode chamar uma função para atualizar a lista após a exclusão
      showCardProdutos(); // Atualiza a lista após a exclusão
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}
