import Dama from './Dama.js';
class UI {
    constructor(jogo) {
        this.jogo = jogo;
        this.jogoElemento = document.getElementById("jogo");
    }

    construirTabuleiro() {
        this.jogoElemento.innerHTML = "";
        let preta = 0;
        let branca = 0;
        for (let i = 0; i < this.jogo.tabuleiro.tabuleiro.length; i++) {
            const element = this.jogo.tabuleiro.tabuleiro[i];
            let linha = document.createElement("div"); 
            linha.setAttribute("class", "linha");

            for (let j = 0; j < element.length; j++) {
                let col = document.createElement("div"); 
                let dama = document.createElement("div");
                let caseType = "";
                let ocupado = "";

                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                } else {
                    if (j % 2 !== 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                }

                if (this.jogo.tabuleiro.tabuleiro[i][j] === 1) {
                    ocupado = "damaBranca";
                } else if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    ocupado = "damaPreta";
                } else {
                    ocupado = "vazio";
                }

                dama.setAttribute("class", "ocupado " + ocupado);
                dama.setAttribute("linha", i);
                dama.setAttribute("coluna", j);
                dama.setAttribute("data-position", i + "-" + j);
                dama.addEventListener("click", (event) => {
                    if (this.jogo.jogadorAtual === -1 && this.jogo.iaAtivada) {
                        return;
                    }
                    this.jogo.moverDama(event);
                });

                col.appendChild(dama);

                col.setAttribute("class", "coluna " + caseType);
                linha.appendChild(col);

                // counter number of each dama
                if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    preta++;
                } else if (this.jogo.tabuleiro.tabuleiro[i][j] === 1) {
                    branca++;
                }

                this.displayCounter(preta, branca);
            }

            this.jogoElemento.appendChild(linha);
        }
    }

    showJogadorAtual() {
        var container = document.getElementById("proximo-jogador");
        if (container.classList.contains("damaBranca")) {
            container.setAttribute("class", "ocupado damaPreta");
        } else {
            container.setAttribute("class", "ocupado damaBranca");
        }
    }

    marcarPosicoesPossiveis(posicaoAtual, direcaoVertical = 0, direcaoHorizontal = 0) {
        const novaLinha = posicaoAtual.linha + direcaoVertical;
        const novaColuna = posicaoAtual.coluna + direcaoHorizontal;
    
        const posicao = document.querySelector(`[data-position='${novaLinha}-${novaColuna}']`);
        if (posicao) {
            posicao.style.background = "green";
            // Salvar onde pode mover
            this.jogo.novaPosicao.push(new Dama(novaLinha, novaColuna));
        }
    }

    displayCounter(preta, branco) {
        var containerPreto = document.getElementById("contador-damasPretas");
        var containerBranco = document.getElementById("contador-damasBrancas");
        containerPreto.innerHTML = preta;
        containerBranco.innerHTML = branco;
    }
}
export default UI;