# 🌱 EcoCerâmica — Frontend UI

Bem-vindo ao repositório frontend da **EcoCerâmica**, uma plataforma moderna projetada para a gestão sustentável na indústria cerâmica.

Este projeto funciona como um *sandbox* e ambiente base de UI, demonstrando uma integração elegante, robusta e moderna entre componentes de interface ricos e estilização via classes utilitárias.

## 🚀 Tecnologias e Arquitetura

O ecossistema frontend foi desenhado buscando performance, manutenibilidade e flexibilidade visual:

- **[React 19](https://react.dev/) & [Vite](https://vitejs.dev/)**: Base do projeto, entregando renderização rápida e um servidor de desenvolvimento ultrarrápido (HMR).
- **[PrimeReact v10](https://primereact.org/)**: Biblioteca de componentes UI premium. Configurada de forma nativa no modo **Unstyled**, permitindo que o design estrutural do PrimeReact seja preservado sem trazer estilos engessados.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilização. Toda a aparência dos componentes PrimeReact (cores, espaçamentos, bordas, hover effects) é controlada exclusivamente via *Tailwind Passthrough*.
- **[Tailwind Merge (`tailwind-merge`)](https://github.com/dcastil/tailwind-merge)**: Ferramenta essencial configurada na raiz da aplicação para resolver dinamicamente e de forma inteligente quaisquer conflitos de classes Tailwind ao customizar componentes PrimeReact via prop `className`.

## 🎨 Design & Funcionalidades (Dark Mode)

A aplicação conta com um sistema de **Dark Mode Dinâmico** cuidadosamente elaborado:
- **Transições Suaves**: A transição entre os modos claro e escuro é animada via CSS (`.theme-transition`), garantindo ausência de "flashes" ou saltos abruptos de cores.
- **Detecção Inteligente**: Ao primeiro acesso, a aplicação verifica a preferência do sistema operacional do usuário (`prefers-color-scheme`).
- **Persistência**: A preferência escolhida é salva no `localStorage`, respeitando a decisão do usuário em acessos futuros.
- **Glassmorphism**: Detalhes polidos como botões flutuantes utilizando fundos semitransparentes com efeitos de blur (`backdrop-blur`).

## 🛠️ Como Executar o Projeto

**Pré-requisitos**: Node.js instalado na sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:ecoceramica-pf/app-frontend.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra `http://localhost:5173` (ou a porta disponibilizada pelo Vite) no seu navegador.

## 📂 Estrutura de Diretórios Destaque

```text
src/
 ├── components/
 │    └── DarkModeToggle.jsx   # Componente flutuante e gerência do dark mode
 ├── index.css                 # Import do Tailwind v4 e camadas base da aplicação
 ├── main.jsx                  # Ponto de entrada (Configuração Unstyled + twMerge)
 └── App.jsx                   # Sandbox principal exibindo a biblioteca de componentes
```

## 📝 Notas de Desenvolvimento

- **Módulo Passthrough Tailwind:** O Tailwind v4, por design, foca na performance omitindo a varredura (scan) da pasta `node_modules`. Para que o PrimeReact unstyled funcione corretamente, a diretiva `@source "../node_modules/primereact/**/*.{js,cjs,mjs}";` foi adicionada estrategicamente no `index.css`.
- **Tipografia:** O projeto usa nativamente a fonte **Inter** (via Google Fonts), substituindo a fonte padrão do sistema para entregar um aspecto mais corporativo e premium.
