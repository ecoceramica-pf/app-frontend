import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind'
import { twMerge } from 'tailwind-merge'
import App from './App.jsx'

// 1. CSS principal com Tailwind v4 + dark mode
import './index.css'

// 2. Ícones do PrimeReact
import 'primeicons/primeicons.css'

/**
 * PrimeReact em modo UNSTYLED com passthrough Tailwind.
 *
 * Isso significa que TODOS os estilos dos componentes PrimeReact vêm
 * das classes Tailwind definidas no preset `Tailwind` do passthrough.
 * O dark mode funciona via a classe `.dark` no <html>, que ativa
 * as variantes `dark:` do Tailwind tanto nos componentes PrimeReact
 * quanto no layout da aplicação.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind, ptOptions: { mergeSections: true, mergeProps: true, classNameMergeFunction: twMerge } }}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
