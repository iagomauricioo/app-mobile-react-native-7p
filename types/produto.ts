export interface Variacao {
  id: number;
  tamanhoMl: number;
  nomeTamanho: string;
  precoCentavos: number;
  ativo: boolean;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  disponivel: boolean;
  imagemUrl: string;
  variacoes: Variacao[];
}
