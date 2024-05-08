class Dama {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
        this.rei = false;
    }

    comparar(dama) {
        return dama.linha === this.linha && dama.coluna === this.coluna;
    }

    promoverDama(){
        this.rei = true;
    }
}
export default Dama;