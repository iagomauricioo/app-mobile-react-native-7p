export function formatCentavos(centavos: number): string {
  return `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;
}

export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
