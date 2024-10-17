// Cria minha lista de tarefas
let minhaLista = document.getElementsByTagName("li");
    for (let i=0; i<minhaLista.length; i++) {
      addCloseButton(minhaLista[i]);
    }
    // ao clicar marca o item da lista como feito
    let lista = document.querySelector("ul");
    lista.addEventListener("click",
      function (ev) {
        if (ev.target.tagName === "LI") {
          ev.target.classList.toggle("checked");
        }
      },
      false
    );

    // Quando a página for recarregada as tarefas do localStorage são carregadas
    carregarTarefas();

    function carregarTarefas() {
      let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
      tarefas.forEach(function (tarefa) {
        addTarefaLista(tarefa.id, tarefa.descricao);
      });
    }
    // adiciona a tarefa na lista
    function addTarefaLista(id, descricao) {
      let li = document.createElement("li");
      li.setAttribute('data-id', id); 
      li.appendChild(document.createTextNode(descricao));
      document.getElementById("itemLista").appendChild(li);
      addCloseButton(li);
    }

    function addElemento() {
      let inputValue = document.getElementById("tarefa").value.toUpperCase();
      if (inputValue === "") {
        alert("Você precisa descrever a tarefa");
        return;
      }
      // mostra a data que a tarefa foi adicionada
      let hoje = new Date();
      let dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
      let descricao = `${dataFormatada} - ${inputValue}`;

      let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
      let id = tarefas.length > 0 ? Math.max(...tarefas.map(tarefa => tarefa.id)) + 1 : 1;

      let novaTarefa = { id: id, descricao: descricao };
      tarefas.push(novaTarefa);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));

      addTarefaLista(id, descricao);
      document.getElementById("tarefa").value = "";
    }

    function addCloseButton(li) {
      let span = document.createElement("SPAN");
      let txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

      span.onclick = function () {
        let div = this.parentElement;
        let id = parseInt(div.getAttribute('data-id'));
        removerTarefaDoLocalStorage(id);
        div.style.display = "none";
      };

      let editSpan = document.createElement("SPAN");
      let editTxt = document.createTextNode("\u270E"); 
      editSpan.className = "edit";
      editSpan.appendChild(editTxt);
      li.appendChild(editSpan);

      editSpan.onclick = function() {
        let div = this.parentElement;
        let oldText = div.firstChild.textContent;
        let input = document.createElement("input");
        input.type = "text";
        input.value = oldText.substring(13); 
        div.replaceChild(input, div.firstChild);

        input.onblur = function() {
          let novoTexto = `${oldText.substring(0, 13)}${input.value.toUpperCase()}`; 
          div.replaceChild(document.createTextNode(novoTexto), input);

          // Atualiza o localStorage após a edição
          let id = parseInt(div.getAttribute('data-id'));
          atualizarTarefaNoLocalStorage(id, novoTexto);
        }
      }
    }

    function removerTarefaDoLocalStorage(id) {
      let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
      tarefas = tarefas.filter(tarefa => tarefa.id !== id);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }

    function limparLista() {
      document.getElementById("itemLista").innerHTML = "";
      localStorage.removeItem("tarefas");
    }