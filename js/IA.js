import Dama from './Dama.js';

class Ia {
    constructor(jogo) {
        this.jogo = jogo;
    }

    executar() {
        const damasPretas = this.encontrarDamasPretas();
        const damasValidas = this.filtrarDamasValidas(damasPretas);
        const damasValidasCapturadas = this.filtrarDamasValidasParaCaptura(damasPretas);
        const damasReisCapturadoras = damasPretas.filter(dama => dama.rei && this.podeCapturar(dama));

        if (damasReisCapturadoras.length > 0) {
            this.executarCaptura(damasReisCapturadoras);
        } else if (damasValidasCapturadas.length > 0) {
            this.executarCaptura(damasValidasCapturadas);
        } else if (damasValidas.length > 0) {
            this.executarMovimento(damasValidas);
        }
    }


    encontrarDamasPretas() {
        let damasPretas = [];
        for (let i = 0; i < this.jogo.tabuleiro.tabuleiro.length; i++) {
            for (let j = 0; j < this.jogo.tabuleiro.tabuleiro[i].length; j++) {
                if (this.jogo.tabuleiro.tabuleiro[i][j] === -1) {
                    let dama = new Dama(i, j);
                    if (i === 9) {
                        dama.promoverDama();
                        console.log("Virei REIII");
                    }
                    damasPretas.push(dama);
                }
            }
        }
        return damasPretas;
    }

    filtrarDamasValidas(damasPretas) {
        return damasPretas.filter(dama => dama.rei ? this.podeMoverComoRei(dama) : this.podeMoverParaBaixo(dama));
    }

    podeMoverParaBaixo(dama) {
        let baixoEsquerda = this.verificarMovimento(dama, 1, -1);
        let baixoDireita = this.verificarMovimento(dama, 1, 1);
        return baixoEsquerda || baixoDireita;
    }

    podeMoverComoRei(dama) {
        let baixoEsquerda = this.verificarMovimento(dama, 1, -1);
        let baixoDireita = this.verificarMovimento(dama, 1, 1);
        let cimaEsquerda = this.verificarMovimento(dama, -1, -1);
        let cimaDireita = this.verificarMovimento(dama, -1, 1);
        return baixoEsquerda || baixoDireita || cimaEsquerda || cimaDireita;
    }

    verificarMovimento(dama, deslocamentoLinha, deslocamentoColuna) {
        let novaLinha = dama.linha + deslocamentoLinha;
        let novaColuna = dama.coluna + deslocamentoColuna;
        // Verifica se a nova posição está dentro dos limites do tabuleiro
        if (novaLinha < 0 || novaLinha >= this.jogo.tabuleiro.tabuleiro.length ||
            novaColuna < 0 || novaColuna >= this.jogo.tabuleiro.tabuleiro[0].length) {
            return false;
        }
        return this.jogo.tabuleiro.tabuleiro[novaLinha][novaColuna] === 0;
    }

    filtrarDamasValidasParaCaptura(damasPretas) {
        return damasPretas.filter(dama => this.podeCapturar(dama));
    }

    podeCapturar(dama) {
        // Se a dama é um rei, verifica todas as direções
        if (dama.rei) {
            return this.verificarCaptura(dama, -2, -2) || this.verificarCaptura(dama, -2, 2) ||
                this.verificarCaptura(dama, 2, -2) || this.verificarCaptura(dama, 2, 2);
        } else {
            // Se a dama não é um rei, verifica apenas as diagonais para baixo
            return this.verificarCaptura(dama, 2, -2) || this.verificarCaptura(dama, 2, 2);
        }
    }

    verificarCaptura(dama, deslocamentoLinha, deslocamentoColuna) {
        let meioLinha = dama.linha + deslocamentoLinha / 2;
        let meioColuna = dama.coluna + deslocamentoColuna / 2;
        let finalLinha = dama.linha + deslocamentoLinha;
        let finalColuna = dama.coluna + deslocamentoColuna;
        return meioLinha < this.jogo.tabuleiro.tabuleiro.length &&
            meioColuna >= 0 &&
            meioColuna < this.jogo.tabuleiro.tabuleiro[0].length &&
            finalLinha < this.jogo.tabuleiro.tabuleiro.length &&
            finalColuna >= 0 &&
            finalColuna < this.jogo.tabuleiro.tabuleiro[0].length &&
            this.jogo.tabuleiro.tabuleiro[meioLinha][meioColuna] === 1 &&
            this.jogo.tabuleiro.tabuleiro[finalLinha][finalColuna] === 0;
    }

    executarCaptura(damasValidasCapturadas) {
        const indexParaCapturar = Math.floor(Math.random() * damasValidasCapturadas.length);
        const damaParaCapturar = damasValidasCapturadas[indexParaCapturar];

        // Determina as direções possíveis de captura com base se a dama é um rei
        let direcoesPossiveis = [];
        if (this.verificarCaptura(damaParaCapturar, -2, -2)) direcoesPossiveis.push('cimaEsquerda');
        if (this.verificarCaptura(damaParaCapturar, -2, 2)) direcoesPossiveis.push('cimaDireita');
        if (this.verificarCaptura(damaParaCapturar, 2, -2)) direcoesPossiveis.push('baixoEsquerda');
        if (this.verificarCaptura(damaParaCapturar, 2, 2)) direcoesPossiveis.push('baixoDireita');

        // Escolhe uma direção aleatória de captura das possíveis
        let direcaoEscolhida = direcoesPossiveis[Math.floor(Math.random() * direcoesPossiveis.length)];

        // Executa a captura na direção escolhida
        if (direcaoEscolhida === 'cimaEsquerda') {
            this.removerPecaAdversaria(damaParaCapturar, -1, -1);
            this.moverPeca(damaParaCapturar, -2, -2);
        } else if (direcaoEscolhida === 'cimaDireita') {
            this.removerPecaAdversaria(damaParaCapturar, -1, 1);
            this.moverPeca(damaParaCapturar, -2, 2);
        } else if (direcaoEscolhida === 'baixoEsquerda') {
            this.removerPecaAdversaria(damaParaCapturar, 1, -1);
            this.moverPeca(damaParaCapturar, 2, -2);
        } else if (direcaoEscolhida === 'baixoDireita') {
            this.removerPecaAdversaria(damaParaCapturar, 1, 1);
            this.moverPeca(damaParaCapturar, 2, 2);
        }
        // Atualiza o tabuleiro
        this.atualizarTabuleiro();
    }

    executarMovimento(damasValidas) {
        // Log antes de escolher a peça
        console.log('Antes de escolher a peça para mover:', this.jogo.tabuleiro.tabuleiro);

        const indexParaDama = Math.floor(Math.random() * damasValidas.length);
        const damaMovimento = damasValidas[indexParaDama];
        console.log(`Peça escolhida para mover: linha ${damaMovimento.linha}, coluna ${damaMovimento.coluna}`);

        // Log antes de encontrar posições possíveis
        console.log('Antes de encontrar novas posições:', this.jogo.tabuleiro.tabuleiro);

        let possiveisNovasPosicoes = this.encontrarPossiveisMovimentos(damaMovimento);
        console.log(`Posições novas possíveis: ${possiveisNovasPosicoes.length}`);

        // Log antes de mover a peça
        console.log('Antes de mover a peça:', this.jogo.tabuleiro.tabuleiro);

        if (possiveisNovasPosicoes.length > 0) {
            const indexParaPossiveisPosicoes = Math.floor(Math.random() * possiveisNovasPosicoes.length);
            const novaPosicao = possiveisNovasPosicoes[indexParaPossiveisPosicoes];
            console.log(`Movendo peça para: linha ${novaPosicao.linha}, coluna ${novaPosicao.coluna}`);

            this.moverPeca(damaMovimento, novaPosicao.linha - damaMovimento.linha, novaPosicao.coluna - damaMovimento.coluna);

            // Log após mover a peça
            console.log('Após mover a peça:', this.jogo.tabuleiro.tabuleiro);
        }
        this.atualizarTabuleiro();
    }

    removerPecaAdversaria(dama, deslocamentoLinha, deslocamentoColuna) {
        let linhaAdversario = dama.linha + deslocamentoLinha;
        let colunaAdversario = dama.coluna + deslocamentoColuna;
        this.jogo.tabuleiro.tabuleiro[linhaAdversario][colunaAdversario] = 0;
    }

    moverPeca(dama, deslocamentoLinha, deslocamentoColuna) {
        let novaLinha = dama.linha + deslocamentoLinha;
        let novaColuna = dama.coluna + deslocamentoColuna;
        this.jogo.tabuleiro.tabuleiro[dama.linha][dama.coluna] = 0;
        this.jogo.tabuleiro.tabuleiro[novaLinha][novaColuna] = -1;
    }

    encontrarPossiveisMovimentos(dama) {
        let possiveisNovasPosicoes = [];
        if (dama.rei) {
            // Verifica movimentos de rei em todas as direções
            if (this.verificarMovimento(dama, -1, -1)) possiveisNovasPosicoes.push(new Dama(dama.linha - 1, dama.coluna - 1));
            if (this.verificarMovimento(dama, -1, 1)) possiveisNovasPosicoes.push(new Dama(dama.linha - 1, dama.coluna + 1));
            if (this.verificarMovimento(dama, 1, -1)) possiveisNovasPosicoes.push(new Dama(dama.linha + 1, dama.coluna - 1));
            if (this.verificarMovimento(dama, 1, 1)) possiveisNovasPosicoes.push(new Dama(dama.linha + 1, dama.coluna + 1));
        } else {
            // Verifica movimentos normais de dama apenas para baixo
            if (this.verificarMovimento(dama, 1, -1)) possiveisNovasPosicoes.push(new Dama(dama.linha + 1, dama.coluna - 1));
            if (this.verificarMovimento(dama, 1, 1)) possiveisNovasPosicoes.push(new Dama(dama.linha + 1, dama.coluna + 1));
        }
        return possiveisNovasPosicoes;
    }

    atualizarTabuleiro() {
        this.jogo.ui.construirTabuleiro();
        this.jogo.jogadorAtual = this.jogo.trocarJogador(this.jogo.jogadorAtual);
        this.jogo.ui.showJogadorAtual();
    }

}

export default Ia;