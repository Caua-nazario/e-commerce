function openAccount() {
    const menu = document.getElementById("accountMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }

}

function cadastrar() {
    
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (nome === "" || email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("emailUsuario", email);
    
    alert("Cadastro realizado com sucesso!");
}

function verificarUsuario() {

    const nome = localStorage.getItem("nomeUsuario");

    if (nome) {
        document.getElementById("btnAccount").querySelector(".tooltip").innerText = nome;
    }
}

verificarUsuario();


function verificarEmail() {
    
    const email = localStorage.getItem("emailUsuario");

    if (email) {
        document.getElementById("btnAccount").querySelector(".tooltip").innerText = email;
    }
}

verificarEmail();