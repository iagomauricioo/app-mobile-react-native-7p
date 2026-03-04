import { STATUS_LABELS } from './statusHelpers';
import { formatCentavos } from './format';

/**
 * Valida e normaliza uma cor hex para o formato #RRGGBB.
 * Aceita #RGB e #RRGGBB.
 */
function normalizeHex(hex: string): string {
  const match = hex.match(/^#([0-9a-fA-F]{3})$|^#([0-9a-fA-F]{6})$/);
  if (!match) {
    throw new Error(`Cor hex inválida: "${hex}". Use o formato #RGB ou #RRGGBB.`);
  }
  if (match[1]) {
    const [r, g, b] = match[1];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return `#${match[2]!.toUpperCase()}`;
}

/**
 * Calcula a luminância relativa de uma cor hex conforme WCAG 2.2.
 * @see https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */
export function getLuminance(hexColor: string): number {
  const normalized = normalizeHex(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calcula a razão de contraste entre duas cores hex (valor entre 1 e 21).
 * @see https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verifica se o contraste entre duas cores atende ao nível AA para texto normal (>= 4.5:1).
 */
export function meetsContrastAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Formata uma data ISO para formato longo em português (ex: "15 de janeiro de 2025").
 */
function formatarDataLonga(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return 'data desconhecida';
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'data desconhecida';
  }
}

/**
 * Formata uma data ISO para formato curto dd/MM (ex: "01/01").
 */
function formatarDataCurta(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '??/??';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return '??/??';
  }
}

/**
 * Gera rótulo de acessibilidade para card de pedido.
 * Retorna: "Pedido 42, cliente João Silva, R$ 35,90, status Preparando, 15 de janeiro de 2025"
 */
export function gerarRotuloPedido(pedido: {
  id?: number;
  cliente?: { nome?: string };
  totalCentavos?: number;
  status?: string;
  dataPedido?: string;
}): string {
  const id = pedido.id ?? 0;
  const nome = pedido.cliente?.nome || 'desconhecido';
  const valor = formatCentavos(pedido.totalCentavos ?? 0);
  const statusLabel = STATUS_LABELS[pedido.status as keyof typeof STATUS_LABELS] || pedido.status || 'desconhecido';
  const data = pedido.dataPedido ? formatarDataLonga(pedido.dataPedido) : 'data desconhecida';

  return `Pedido ${id}, cliente ${nome}, ${valor}, status ${statusLabel}, ${data}`;
}

/**
 * Gera rótulo de acessibilidade para card de cupom.
 * Retorna: "Cupom PROMO10, desconto percentual de 10%, ativo, válido de 01/01 a 31/01, 5 de 100 usos"
 */
export function gerarRotuloCupom(cupom: {
  codigo?: string;
  tipoDesconto?: string;
  valorDesconto?: number;
  ativo?: boolean;
  dataInicio?: string;
  dataFim?: string;
  quantidadeUsos?: number;
  limiteUsos?: number;
}): string {
  const codigo = cupom.codigo || 'desconhecido';
  const tipo = cupom.tipoDesconto === 'PERCENTUAL' ? 'percentual' : 'valor fixo';
  const valor = cupom.tipoDesconto === 'PERCENTUAL'
    ? `${cupom.valorDesconto ?? 0}%`
    : formatCentavos(cupom.valorDesconto ?? 0);
  const estado = cupom.ativo ? 'ativo' : 'inativo';
  const inicio = cupom.dataInicio ? formatarDataCurta(cupom.dataInicio) : '??/??';
  const fim = cupom.dataFim ? formatarDataCurta(cupom.dataFim) : '??/??';
  const usos = `${cupom.quantidadeUsos ?? 0} de ${cupom.limiteUsos ?? 0} usos`;

  return `Cupom ${codigo}, desconto ${tipo} de ${valor}, ${estado}, válido de ${inicio} a ${fim}, ${usos}`;
}
