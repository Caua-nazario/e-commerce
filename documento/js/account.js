//o js foi feito por completo no claude code ,com muito cuidado e uso consciente: ass-caua(sou fraco em js ainda)

const tabs = document.querySelectorAll('.tab-btn');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('submit-btn');
const forgotLink = document.getElementById('forgot-link');
const indicator = document.querySelector('.tab-indicator');
const form = document.getElementById('auth-form');
const btnGoogle = document.getElementById('btn-google');

function switchTab(type, clickedBtn) {
    // Remove a classe ativa de todos os botões de aba
    tabs.forEach(b => b.classList.remove('active'));

    // Adiciona a classe ativa no botão que foi clicado
    clickedBtn.classList.add('active');

    if (type === 'login') {
        // Esconde o campo nome
        nameGroup.classList.remove('aberto');
        submitBtn.textContent = 'Entrar';

        // Mostra o link de recuperar senha
        forgotLink.classList.remove('oculto');

        // Move o indicador para a esquerda (aba Login)
        indicator.classList.remove('direita');
    } else {
        // Mostra o campo nome
        nameGroup.classList.add('aberto');
        submitBtn.textContent = 'Cadastrar';

        // Esconde o link de recuperar senha
        forgotLink.classList.add('oculto');

        // Move o indicador para a direita (aba Criar Conta)
        indicator.classList.add('direita');
    }
}

function loginGoogle() {
    alert('Conta logada com sucesso com o Google!');
}

// Liga os botões (no lugar dos onclick que estavam no HTML)
tabs[0].addEventListener('click', () => switchTab('login', tabs[0]));
tabs[1].addEventListener('click', () => switchTab('register', tabs[1]));
btnGoogle.addEventListener('click', loginGoogle);

// temporario , vou tirar no back end
form.addEventListener('submit', (e) => e.preventDefault());