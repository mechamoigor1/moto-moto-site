# Identidade visual Moto Moto

## Objetivo

Atualizar a identidade do site público e do painel administrativo para usar o logo oficial Moto Moto e SVGs no lugar de todos os emojis. Manter a paleta atual: preto, grafite, laranja `#ff6b00` e verde de WhatsApp.

## Marca e ícones

- Copiar o logo oficial de `C:\Users\Sancs\Downloads\igor projeto\MOTO MOTO LOGO.svg` para `public/brand/moto-moto-logo.svg`.
- Criar um componente reutilizável de marca para cabeçalho, rodapé e painel, com dimensões e texto alternativo adequados a cada contexto.
- Criar uma biblioteca local de ícones SVG, de traço consistente, para navegação, financiamento, diferenciais, ações e painel administrativo.
- Não manter caracteres emoji em componentes de interface. Ícones informativos terão `aria-hidden`; botões somente com ícone terão rótulo acessível.

## Navegação pública

### Desktop

- A top bar fixa terá o logo centralizado, contexto da loja à esquerda e a ação do WhatsApp à direita.
- O menu de navegação ficará em uma segunda faixa imediatamente abaixo da top bar.
- As superfícies da top bar, do menu e dos botões terão efeito liquid glass discreto: fundo translúcido, `backdrop-filter`, borda clara de baixa opacidade e brilho interno sutil. O laranja continuará reservado para ações e estado ativo.

### Mobile

- A top bar exibirá o acionador de menu à esquerda, o logo oficial centralizado e o acesso ao WhatsApp à direita.
- O menu ficará em uma faixa própria logo abaixo da top bar no início da página.
- Após a rolagem, a faixa de menu se recolhe verticalmente para cima. A top bar continua fixa, com opacidade menor, mantendo logo e ações acessíveis.
- A transição respeitará `prefers-reduced-motion` e não deve provocar deslocamento de conteúdo.

## Painel administrativo

- A barra lateral e a tela de login passam a usar o logo oficial.
- Todos os emojis em links, botões, mensagens e indicadores serão substituídos pela biblioteca SVG local.
- A linguagem visual mantém as cores e hierarquia existentes; liquid glass será aplicado apenas onde houver superfície de navegação ou ação, sem reduzir contraste de dados e formulários.

## Componentes e dados

- `BrandLogo`: encapsula caminho do logo, tamanho, prioridade visual e acessibilidade.
- `Icon`: recebe um identificador finito e renderiza o SVG correspondente com classes de estilo.
- `Header`: controla menu mobile e estado de rolagem sem mudar os dados de configuração ou links atuais.
- As configurações existentes continuam fornecendo cidade, WhatsApp e nome da loja; o SVG do logo deixa de depender de texto derivado do nome.

## Tratamento de falhas

- O logo terá texto alternativo “Moto Moto”. Caso a imagem não seja carregada, o navegador mostra esse texto alternativo sem quebrar a navegação.
- O controle de rolagem será protegido para execução somente no cliente e removido ao desmontar o componente.
- Sem suporte a `backdrop-filter`, as superfícies mantêm um fundo escuro semitransparente legível.

## Verificação

- Testes de componente validarão o logo, substituição de emojis e rótulos acessíveis dos controles novos.
- Testes de interação validarão abertura/fechamento do menu mobile e o recolhimento após rolagem.
- Verificar lint, testes existentes, build de produção e visualmente os estados desktop e mobile.
