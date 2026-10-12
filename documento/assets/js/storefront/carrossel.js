/**
 * Controla a troca automática e manual dos banners e sincroniza os indicadores do carrossel.
 */
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

/**
 * Ativa o slide solicitado e atualiza o indicador correspondente.
 */
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

/**
 * Avança para o próximo slide, retornando ao início ao chegar ao último.
 */
function proximoSlide() {
    let proximo = (slideAtual + 1) % slides.length;
    mudarParaSlide(proximo);
}

/**
 * Volta ao slide anterior, indo ao final quando estiver no primeiro.
 */
function slideAnterior() {
    let anterior = (slideAtual - 1 + slides.length) % slides.length;
    mudarParaSlide(anterior);
}

/**
 * Inicia a troca automática dos banners a cada três segundos.
 */
function iniciarAutoSlide() {
    tempoTroca = setInterval(proximoSlide, 3000);
}

/**
 * Reinicia o temporizador depois de uma interação manual do visitante.
 */
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