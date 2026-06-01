# TODO: Melhorias Técnicas e Refatorações

## Conflitos de Estilos (PrimeReact Unstyled + Tailwind v4)

**Problema:**
A configuração do `primereact/passthrough/tailwind` combinada com o `tailwind-merge` causa conflitos agressivos ao tentar sobrescrever as cores padrão (ex: `bg-blue-500`) dos componentes (como o `<Button>`). 
Como o `tailwind-merge` apaga classes conflitantes usando análise de prefixos (`bg-`), tentativas de usar `className="bg-primary"` falham porque a classe é removida do HTML final.

**Solução Atual (Workaround):**
- Foi criada uma classe isolada chamada `.theme-btn-primary` no `src/index.css` que não possui o prefixo `bg-`, escapando da heurística de exclusão do `tailwind-merge`.
- Essa classe impõe o fundo azul marinho usando `background-color: var(--color-primary) !important;`.
- Usamos `className="theme-btn-primary"` nos componentes.

**Melhorias Futuras a serem investigadas:**
- [ ] **Sobrescrever o Passthrough Global:** Estudar como modificar ou estender globalmente o preset do `primereact/passthrough/tailwind` injetando diretamente as variáveis do tema, de modo que o PrimeReact gere `bg-primary` desde o nascimento do componente, descartando a cor `blue-500`.
- [ ] **Configuração Avançada do twMerge:** Criar um script dedicado de configuração do `tailwind-merge` que entenda e respeite a prioridade das variáveis do Tailwind v4 (`@theme { --color-... }`) em relação aos utilitários padrão.
- [ ] **Substituição de Componentes Críticos:** Se as limitações do Passthrough persistirem ou engessarem o layout, avaliar a substituição dos botões principais por componentes nativos (`<button>`) usando exclusivamente Tailwind ou Shadcn UI.
