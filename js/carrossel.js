// 1. Seleciona os elementos do HTML usando seus IDs
const slides = document.querySelectorAll('.slide');
const btnAfter = document.getElementById('btn-after');
const btnBefore = document.getElementById('btn-before');

let slideAtual = 0;
let tempoTroca; // Variável para armazenar o temporizador

// 2. Função para ir para o próximo slide
function proximoSlide() {
    slides[slideAtual].classList.remove('ativo'); // Esconde o slide atual
    slideAtual++; // Avança 1 na contagem
    
    if (slideAtual >= slides.length) {
        slideAtual = 0; // Se passou do último, volta para o primeiro (Slide 0)
    }
    
    slides[slideAtual].classList.add('ativo'); // Mostra o novo slide
}

// 3. Função para voltar para o slide anterior
function slideAnterior() {
    slides[slideAtual].classList.remove('ativo'); // Esconde o slide atual
    slideAtual--; // Volta 1 na contagem
    
    if (slideAtual < 0) {
        slideAtual = slides.length - 1; // Se passou do primeiro, vai para o último
    }
    
    slides[slideAtual].classList.add('ativo'); // Mostra o novo slide
}

// 4. Inicia a troca automática (a cada 3000ms = 3 segundos)
function iniciarAutoSlide() {
    tempoTroca = setInterval(proximoSlide, 3000);
}

// 5. Reinicia o tempo ao clicar manualmente em um botão
function reiniciarTempo() {
    clearInterval(tempoTroca); // Para o tempo atual
    iniciarAutoSlide();        // Reinicia a contagem do zero
}

// 6. Conecta os cliques dos botões com as funções
btnAfter.addEventListener('click', () => {
    proximoSlide();
    reiniciarTempo();
});

btnBefore.addEventListener('click', () => {
    slideAnterior();
    reiniciarTempo();
});

// Executa a troca automática assim que a página carrega
iniciarAutoSlide();