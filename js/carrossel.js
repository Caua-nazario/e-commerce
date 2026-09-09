// 1. Seleciona os elementos do HTML
const slides = document.querySelectorAll('.slide');
const btnAfter = document.getElementById('btn-after');
const btnBefore = document.getElementById('btn-before');
const carousel = document.getElementById('carousel');

let slideAtual = 0;
let tempoTroca;
let trocandoSlide = false; // Trava contra cliques ultra rápidos

// 2. Criar a estrutura dos indicadores (bolinhas)
const containerIndicadores = document.createElement('div');
containerIndicadores.classList.add('indicadores');
carousel.appendChild(containerIndicadores);

// Cria uma bolinha para cada slide existente
slides.forEach((_, index) => {
    const bolinha = document.createElement('div');
    bolinha.classList.add('bolinha');
    if (index === 0) bolinha.classList.add('ativa');
    
    // interacao com a bolinha
    bolinha.addEventListener('click', () => {
        if (trocandoSlide || index === slideAtual) return;
        mudarParaSlide(index);
        reiniciarTempo();
    });

    containerIndicadores.appendChild(bolinha);
});

const bolinhas = containerIndicadores.querySelectorAll('.bolinha');

// 3. mudar as bolinhas e slides
function mudarParaSlide(novoIndex) {
    trocandoSlide = true;

    // Remove ativo do slide e da bolinha atual
    slides[slideAtual].classList.remove('ativo');
    bolinhas[slideAtual].classList.remove('ativa');

    // Atualiza o índice do slide atual
    slideAtual = novoIndex;

    // Adiciona ativo no novo slide e na nova bolinha
    slides[slideAtual].classList.add('ativo');
    bolinhas[slideAtual].classList.add('ativa');

    // permitir o clique a partir de  (300ms)
    setTimeout(() => {
        trocandoSlide = false;
    }, 300);
}

// 4. Funções de navegação
function proximoSlide() {
    let proximo = (slideAtual + 1) % slides.length;
    mudarParaSlide(proximo);
}

function slideAnterior() {
    let anterior = (slideAtual - 1 + slides.length) % slides.length;
    mudarParaSlide(anterior);
}

// 5. Controle do Temporizador
function iniciarAutoSlide() {
    tempoTroca = setInterval(proximoSlide, 3000);
}

function reiniciarTempo() {
    clearInterval(tempoTroca);
    iniciarAutoSlide();
}

// 6. botoes laterais
btnAfter.addEventListener('click', () => {
    if (trocandoSlide) return;
    proximoSlide();
    reiniciarTempo();
});

btnBefore.addEventListener('click', () => {
    if (trocandoSlide) return;
    slideAnterior();
    reiniciarTempo();
});

// Inicia a troca automática
iniciarAutoSlide();