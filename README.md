# Caldos Admin - App Mobile

Aplicativo móvel administrativo para o sistema **Caldos e Sopas CG**, desenvolvido em React Native com Expo.

## 📱 Visão Geral

O app permite que administradores do restaurante gerenciem pedidos, produtos e cupons diretamente do celular. Funciona como complemento ao painel web administrativo.

### Funcionalidades

- **Dashboard**: Status da loja (aberta/fechada), resumo de vendas do dia, pedidos por status
- **Pedidos**: Listagem, filtro por status, atualização de status, cancelamento
- **Produtos**: Visualização do cardápio com variações e preços
- **Cupons**: Listagem e criação de cupons de desconto

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Expo | 54 | Framework React Native |
| React Native | 0.81 | UI nativa |
| TypeScript | 5.3 | Tipagem estática |
| TanStack Query | 5.x | Cache e estado do servidor |
| Zustand | 5.x | Estado global (autenticação) |
| Axios | 1.x | Requisições HTTP |
| Zod | 3.x | Validação de dados |
| Expo Router | 6.x | Navegação file-based |

## 📁 Estrutura do Projeto

```
mobile/
├── app/                    # Telas (file-based routing)
│   ├── _layout.tsx         # Layout raiz + providers
│   ├── login.tsx           # Tela de login
│   ├── (tabs)/             # Navegação por abas
│   │   ├── _layout.tsx     # Configuração das tabs
│   │   ├── index.tsx       # Dashboard
│   │   ├── pedidos.tsx     # Lista de pedidos
│   │   ├── produtos.tsx    # Lista de produtos
│   │   └── cupons.tsx      # Lista e criação de cupons
│   └── pedido/
│       └── [id].tsx        # Detalhes do pedido
├── components/             # Componentes reutilizáveis
│   ├── PedidoCard.tsx      # Card de pedido
│   ├── ProdutoCard.tsx     # Card de produto
│   ├── CupomCard.tsx       # Card de cupom
│   ├── CriarCupomForm.tsx  # Formulário de cupom
│   └── StatusBadge.tsx     # Badge de status
├── hooks/                  # React hooks customizados
│   ├── usePedidos.ts       # CRUD de pedidos
│   ├── useProdutos.ts      # Listagem de produtos
│   ├── useCupons.ts        # CRUD de cupons
│   └── useDashboard.ts     # Dados do dashboard
├── services/               # Camada de API
│   ├── api.ts              # Instância Axios configurada
│   ├── authService.ts      # Autenticação
│   ├── pedidoService.ts    # Endpoints de pedidos
│   ├── produtoService.ts   # Endpoints de produtos
│   ├── cupomService.ts     # Endpoints de cupons
│   └── restauranteService.ts # Status da loja
├── stores/                 # Estado global
│   └── useAuthStore.ts     # Store de autenticação
├── types/                  # Tipos TypeScript
│   ├── pedido.ts           # Tipos de pedido
│   ├── produto.ts          # Tipos de produto
│   ├── cupom.ts            # Tipos de cupom
│   └── api.ts              # Tipos de resposta da API
└── utils/                  # Utilitários
    ├── accessibility.ts    # Funções de acessibilidade
    ├── statusHelpers.ts    # Cores e labels de status
    ├── format.ts           # Formatação (moeda, data)
    ├── jwt.ts              # Validação de token
    └── validations.ts      # Validações Zod
```

## 🔐 Autenticação

O app usa JWT (JSON Web Token) para autenticação:

1. Usuário faz login com credenciais
2. Backend retorna token JWT
3. Token é salvo no AsyncStorage via Zustand (persistido)
4. Todas as requisições incluem o token no header `Authorization: Bearer <token>`
5. Se token expirar ou for inválido, usuário é redirecionado para login

```typescript
// stores/useAuthStore.ts
const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
      isAuthenticated: () => {
        const token = get().token;
        return token && isTokenValid(token);
      },
    }),
    { name: 'caldos-admin-auth', storage: AsyncStorage }
  )
);
```

## 🎨 Design System

- **Cor primária**: `#F97316` (laranja)
- **Background**: `#FFF7ED` (creme claro)
- **Texto principal**: `#1C1917` (quase preto)
- **Texto secundário**: `#78716C` (cinza)
- **Cards**: Fundo branco com sombra sutil e `borderRadius: 16`

## ♿ Acessibilidade (WCAG 2.2 AA)

O app implementa diretrizes de acessibilidade:

### Contraste de Cores
- Todas as cores de texto atendem ao mínimo de **4.5:1** de contraste
- Status badges usam `ACCESSIBLE_STATUS_COLORS` com cores validadas

### Props de Acessibilidade
- `accessibilityLabel`: Descrição para leitores de tela
- `accessibilityRole`: Tipo do elemento (button, header, switch)
- `accessibilityHint`: Dica de interação
- `accessibilityLiveRegion`: Anúncio de mudanças dinâmicas

### Escalabilidade de Fonte
- Botões e badges usam `maxFontSizeMultiplier={1.5}` para limitar escala

### Funções Utilitárias
```typescript
// utils/accessibility.ts
getLuminance(hex)           // Luminância relativa WCAG
getContrastRatio(fg, bg)    // Razão de contraste (1-21)
meetsContrastAA(fg, bg)     // Verifica >= 4.5:1
gerarRotuloPedido(pedido)   // Label descritivo para pedido
gerarRotuloCupom(cupom)     // Label descritivo para cupom
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- Expo Go instalado no celular
- Celular e computador na **mesma rede WiFi**

### Desenvolvimento
```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou câmera (iOS).

### Com Tunnel (redes diferentes)
```bash
npx expo start --tunnel
```

## 📦 Build de Produção

### Configurar EAS
```bash
npm install -g eas-cli
eas login
```

### Build Android (APK para teste)
```bash
eas build --platform android --profile preview
```

### Build Android (AAB para Play Store)
```bash
eas build --platform android --profile production
```

### Build iOS
```bash
eas build --platform ios --profile production
```

## 🔗 API

O app consome a API REST do backend Spring Boot:

- **Base URL**: `https://api.caldosesopacg.com`
- **Autenticação**: Bearer Token (JWT)
- **Formato de resposta**: `{ status, mensagem, data, timestamp }`

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação |
| GET | `/admin/pedidos` | Listar pedidos |
| PATCH | `/admin/pedidos/{id}/status` | Atualizar status |
| GET | `/admin/produtos` | Listar produtos |
| GET | `/admin/cupons` | Listar cupons |
| POST | `/admin/cupons` | Criar cupom |
| GET | `/admin/restaurante/status` | Status da loja |
| PATCH | `/admin/restaurante/status` | Abrir/fechar loja |

## 📊 Fluxo de Status do Pedido

```
RECEBIDO → AGUARDANDO_PAGAMENTO → PREPARANDO → SAIU_ENTREGA → ENTREGUE
                                      ↓
                                  CANCELADO
```

## 🧪 Tipos Principais

```typescript
// Status do pedido
type StatusPedido = 
  | 'RECEBIDO' 
  | 'AGUARDANDO_PAGAMENTO' 
  | 'PREPARANDO' 
  | 'SAIU_ENTREGA' 
  | 'ENTREGUE' 
  | 'CANCELADO';

// Pedido completo
interface PedidoCompleto {
  id: number;
  cliente: { nome: string; telefone: string };
  endereco: { rua: string; numero: string; bairro: string };
  itens: ItemPedido[];
  totalCentavos: number;
  status: StatusPedido;
  formaPagamento: 'PIX' | 'CREDIT_CARD';
  dataPedido: string;
}
```

## 📝 Observações

- Valores monetários são armazenados em **centavos** (inteiros)
- Datas são retornadas em formato ISO 8601
- O app é em **português brasileiro**
- Package name Android: `com.iagomauricio.caldosadmin`
