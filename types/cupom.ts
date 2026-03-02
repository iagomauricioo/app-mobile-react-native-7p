export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export interface Cupom {
  id: number;
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  dataInicio: string;
  dataFim: string;
  limiteUsos: number;
  quantidadeUsos: number;
  ativo: boolean;
  dataCriacao: string;
}

export interface CriarCupomRequest {
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  dataInicio: string;
  dataFim: string;
  limiteUsos: number;
}
