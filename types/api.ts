export interface GlobalResponse<T> {
  status: number;
  mensagem: string;
  data: T;
  timestamp: string;
}
