# **Template de Documentação: Artefato Digital Acessível**

## **1\. Visão Geral e Escopo**

**1.1 Nome do Projeto:** \[Nome\]  
**1.2 Padrão de Acessibilidade Adotado:** WCAG 2.2 Nível AA  
**1.3 Público-alvo:** \[Descrever brevemente\]  
**1.4 Responsável pela Acessibilidade:** \[Nome/Equipe\] 

## **2\. Checklist de Design Acessível (UI/UX)**

**2.1 Contraste de Cores:** Texto e elementos essenciais possuem contraste mínimo de 4.5:1 (para texto normal) ou 3:1 (para texto grande/ícones).  
**2.2 Não uso da cor como único indicador:** Informações não dependem apenas da cor (ex: campos obrigatórios sinalizados por cor e texto/ícone).  
**2.3 Fontes Legíveis:** Uso de fontes sans-serif, tamanho mínimo legível (recomenda-se 16px ou superior).  
**2.4 Foco Visível:** Elementos interativos (links, botões) possuem um indicador de foco claro e visível.  
**2.5 Hierarquia de Títulos:** Uso estruturado de H1, H2, H3 para navegação. 

## **3\. Checklist de Desenvolvimento (Frontend/Backend)**

**3.1 HTML Semântico:** Uso correto de tags (\<nav\>, \<main\>, \<button\>, \<a\>, \<header\>, \<footer\>).  
**3.2 Navegação por Teclado:** Todo o site é navegável via tecla TAB/SHIFT+TAB, sem "armadilhas de foco".  
**3.3 Atributos ALT:** Imagens possuem alt descritivo ou alt="" para imagens decorativas.  
**3.4 Formulários Acessíveis:** Campos de formulário possuem \<label\> associados, mensagens de erro claras e instrução clara.  
**3.5 ARIA Labels (quando necessário):** Uso de aria-label, aria-labelledby para elementos complexos, mas priorizando HTML nativo.  
**3.6 Links Descritivos:** O texto do link explica o destino (evitar "clique aqui"). 

## **4\. Conteúdo e Mídia**

**4.1 Textos Simples:** Linguagem clara, evitando jargões técnicos complexos.  
**4.2 Legendas/Transcrição:** Vídeos possuem legendas e áudios possuem transcrição.  
**4.3 Evitar Piscadas:** Elementos não piscam mais de 3 vezes por segundo. 

## **5\. Ferramentas de Validação e Testes**

**5.1 Automático:** Executado Lighthouse (Chrome DevTools) e Axe DevTools (nota \> 90/100).  
**5.2 Manual:** Navegação completa via teclado.  
**5.3 Leitor de Tela:** Testado com NVDA (Windows) ou VoiceOver (macOS/iOS).  
**5.4 Simulador de Contraste:** Verificado com o stiletest ou outros ou ferramentas internas. 

## **6\. Declaração de Acessibilidade**

**6.1 Publicação:** Página de "Acessibilidade" no rodapé do site, contendo compromisso, nível de conformidade e método de contato para feedback. 

## **Importante\!**

* **Acessibilidade não é opcional:** Deve ser integrada no fluxo de trabalho de design e desenvolvimento, não apenas no final.  
* **Foco na Web:** Padrões WCAG são cruciais.  
* **Ferramentas:** Use Axe, Wave, e Lighthouse para automação. 

# **Adaptado para Mobile**

### **1\. Tradução de Desenvolvimento (Frontend)**

No React Native, não utilizamos tags HTML como `<nav>` ou `<main>`. A adaptação deve focar em propriedades específicas:

* **HTML Semântico → `accessibilityRole`:** Em vez de tags, usamos a prop `accessibilityRole` para definir se um elemento é um "button", "header", "link", etc.  
* **Atributos ALT → `accessibilityLabel`:** Para imagens e elementos interativos, utilizamos `accessibilityLabel` para fornecer a descrição textual que o leitor de tela irá anunciar.  
* **ARIA Labels → `accessibilityHint`:** Para componentes complexos onde o `accessibilityLabel` não é suficiente, usamos o `accessibilityHint` para explicar o que acontece após a interação.

### **2\. Navegação e Foco**

A "Navegação por Teclado" (TAB) da Web se transforma na **ordem de varredura** dos leitores de tela em dispositivos móveis:

* **Foco Visível:** No mobile, o sistema (iOS/Android) geralmente gerencia o indicador de foco (borda retangular). No entanto, é crucial garantir que a ordem dos elementos faça sentido lógico.  
* **Hierarquia de Títulos:** Utilizamos `accessibilityRole="header"` para que usuários de leitores de tela possam navegar rapidamente entre as seções do app, simulando o comportamento dos H1, H2 e H3.

### **3\. Design e Conteúdo**

As diretrizes de design permanecem bastante similares:

* **Contraste e Cores:** Os padrões de 4.5:1 para texto normal e 3:1 para ícones e textos grandes devem ser mantidos rigorosamente no app mobile.  
* **Fontes Legíveis:** Além do tamanho mínimo (16px recomendado), no React Native é importante garantir que o layout não quebre quando o usuário aumentar o tamanho da fonte nas configurações do sistema (fonte dinâmica).

### **4\. Ferramentas de Teste**

A seção de validação precisa ser atualizada, pois ferramentas como Lighthouse e Axe DevTools são exclusivas para navegadores:

* **Manual:** O teste deve ser feito com o **VoiceOver** (iOS) e o **TalkBack** (Android).  
* **Automático (Informação externa):** Para React Native, utilizam-se ferramentas como o *Accessibility Inspector* (Xcode) ou o *Layout Inspector* (Android Studio), além de bibliotecas de linting como o `eslint-plugin-react-native-a11y`.

