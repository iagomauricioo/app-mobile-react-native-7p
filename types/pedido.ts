export type StatusPedido = 'RECEBIDO' | 'AGUARDANDO_PAGAMENTO' | 'PREPARANDO' | 'SAIU_ENTREGA' | 'ENTREGUE' | 'CANCELADO';
export type FormaPagamento = 'PIX' | 'CREDIT_CARD';
export type StatusPagamento = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO' | 'ESTORNADO' | 'EXPIRADO';

export interface PedidoCompleto {
  id: number;
  clienteId: string;
  subTotalCentavos: number;
  taxaEntregaCentavos: number;
  totalCentavos: number;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
  observacoes: string | null;
  dataPedido: string;
  pagamentoStatus: StatusPagamento;
  cliente: { id: string; nome: string; telefone: string; cpf: string | null };
  endereco: { rua: string; numero: string; bairro: string; complemento?: string };
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  nomeProduto: string;
  tamanhoMl: string;
  quantidade: number;
  precoUnitarioCentavos: number;
  observacoes: string | null;
}
