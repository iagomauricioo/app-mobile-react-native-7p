import { z } from 'zod';

export const criarCupomSchema = z.object({
  codigo: z.string()
    .min(3, 'Código deve ter pelo menos 3 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
  tipoDesconto: z.enum(['PERCENTUAL', 'VALOR_FIXO'], {
    errorMap: () => ({ message: 'Selecione o tipo de desconto' }),
  }),
  valorDesconto: z.number()
    .positive('Valor deve ser positivo'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  limiteUsos: z.number()
    .int('Limite deve ser um número inteiro')
    .positive('Limite deve ser positivo'),
}).refine((data) => {
  if (data.dataInicio && data.dataFim) {
    return new Date(data.dataFim) > new Date(data.dataInicio);
  }
  return true;
}, { message: 'Data de fim deve ser posterior à data de início', path: ['dataFim'] });
