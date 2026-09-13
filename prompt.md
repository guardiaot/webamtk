
Iniciando a ETAPA 1 — AUDITORIA do frontend AMTK.

Vou explorar a estrutura do projeto de forma sistemática, começando pela raiz e depois aprofundando em cada área.

  Thought for 1m 12s, searched for 2 patterns, read 25 files, listed 1 directory, ran 2 shell commands

Now let me check some key components and the routing configuration:

  Thought for 5s, read 3 files

Let me check for routes, COMTRADE page, and existing services:

  Thought for 50s, searched for 4 patterns, read 16 files, ran 1 shell command

Let me check the CSS and blade template:

  Thought for 12s, searched for 2 patterns, read 2 files

Now I have a comprehensive understanding of the project. Let me compile the full audit report.

---

ETAPA 1 — AUDITORIA COMPLETA DO FRONTEND AMTK

1. ESTRUTURA REAL DO PROJETO

C:\laragon\www\AMTK\
├── resources/
│   ├── js/
│   │   ├── app.jsx                    (ponto de entrada)
│   │   ├── bootstrap.js               (axios setup)
│   │   ├── ErrorBoundary .jsx         (⚠️ nome com espaço)
│   │   ├── Components/
│   │   │   ├── DataTable.jsx           ✅ Componente reutilizável
│   │   │   ├── OrigemSidebar.jsx       ✅ Sidebar principal
│   │   │   ├── NavBar.jsx              ⚠️ Navbar (legado/Outro projeto)
│   │   │   ├── GreetingBanner.jsx      ⚠️ Banner de saudação (legado)
│   │   │   ├── StatCard.jsx            ✅ Card de estatísticas
│   │   │   ├── SelectApi.jsx           ✅ Select com API
│   │   │   ├── AjaxSumoSelect.jsx      ⚠️ Select legado
│   │   │   └── ... (muitos componentes legados do projeto OrigemRP)
│   │   ├── Layouts/
│   │   │   ├── LayoutAdmin.jsx         ✅ Layout principal
│   │   │   └── GuestLAyout.jsx         ⚠️ Layout visitante (legado)
│   │   ├── Pages/
│   │   │   ├── Home/index.jsx          ✅ Dashboard
│   │   │   ├── IED/index.jsx           ✅ Lista de IEDs
│   │   │   ├── IED/Show/index.jsx      ✅ Detalhe do IED
│   │   │   ├── IED/columns.jsx         ✅ Colunas da tabela
│   │   │   ├── IED/IEDForm.jsx         ✅ Formulário de IED
│   │   │   ├── Telemetry/index.jsx     ✅ Telemetria tempo real
│   │   │   ├── Telemetry/columns.jsx   ✅ Colunas telemetria
│   │   │   ├── Telemetry/History/      ✅ Histórico telemetria
│   │   │   ├── Events/index.jsx        ✅ Eventos (dados mockados)
│   │   │   ├── Oscillography/index.jsx ✅ Oscilografia (dados mockados)
│   │   │   ├── Settings/IEDs/index.jsx ✅ Config IEDs (dados mockados)
│   │   │   ├── Settings/Agents/index.jsx ✅ Config Agents (mockados)
│   │   │   ├── Settings/System/index.jsx ✅ Config Sistema
│   │   │   └── Login/Login.jsx         ⚠️ Login (legado)
│   │   └── utils/
│   │       └── greetingHandler.js      (legado)
│   ├── css/
│   │   ├── app.css                     (Tailwind mínimo)
│   │   └── partial.css
│   └── views/
│       └── app.blade.php               Template Inertia
├── OrigemPHP/
│   ├── Config/
│   │   ├── BaseController.php          (renderInertia)
│   │   ├── Router.php
│   │   └── ...
│   ├── Rotas/
│   │   ├── Rotas.php                   (rotas principais)
│   │   ├── web/Rotas.php               (rotas web)
│   │   └── api/Rotas.php               (rotas API)
│   └── Servicos/
│       ├── Home/Home.php
│       ├── IED/Ieds.php
│       ├── Telemetry/Telemetry.php
│       ├── Telemetry/History.php
│       ├── Events/Events.php
│       ├── Oscillography/Oscillography.php
│       └── Settings/Settings.php
├── public/
│   └── assets/ (Sneat template CSS/JS)
└── ...

---

2. TECNOLOGIAS E VERSÕES

┌─────────────────┬───────────────────────────────────┬────────────────────────────────┐
│   Tecnologia    │              Versão               │           Observação           │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ React           │ 18.2.0                            │ OK                             │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Inertia.js      │ v1.0.0 (React) / v0.2.5 (Laravel) │ ⚠️ Versão PHP antiga           │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Vite            │ 5.0.0                             │ OK                             │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Tailwind CSS    │ 3.2.1                             │ Configurado mas mínimo         │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Bootstrap       │ 5.3.8                             │ Misturado com Tailwind         │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ React Bootstrap │ 2.10.2                            │ Usado no Login                 │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ MUI Material    │ 6.0.1                             │ Instalado mas quase não usado  │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ MDI Icons       │ 7.4.47                            │ Biblioteca principal de ícones │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Chart.js        │ 4.5.1                             │ Instalado mas não usado        │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ ApexCharts      │ 5.12.0                            │ Instalado mas não usado        │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Axios           │ 1.7.7                             │ Usado em algumas chamadas      │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ Fetch API       │ nativo                            │ Usado na maioria das chamadas  │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ jQuery          │ 3.7.1                             │ Instalado mas não necessário   │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ moment          │ 2.30.1                            │ Instalado mas desnecessário    │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ react-hot-toast │ 2.4.1                             │ Sistema de toast               │
├─────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ react-toastify  │ 10.0.5                            │ ⚠️ Segundo sistema de toast!   │
└─────────────────┴───────────────────────────────────┴────────────────────────────────┘

Observações críticas:
- Mistura de Tailwind CSS + Bootstrap (conflito potencial)
- Muitas bibliotecas instaladas mas não utilizadas (Chart.js, ApexCharts, MUI, jQuery, moment)
- Dois sistemas de toast (react-hot-toast + react-toastify)
- Template base: Sneat (Sneat Admin Template) via assets estáticos

---

3. PÁGINAS EXISTENTES E STATUS

┌────────────────┬────────────────────┬─────────────────────────┬────────────────────────────────────┐
│     Página     │        Rota        │         Status          │               Dados                │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Dashboard      │ / ou /home         │ ✅ Funcional            │ API real (/home-panel-informacoes) │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ IEDs (lista)   │ /ieds              │ ✅ Funcional            │ API real (/lista/ieds)             │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ IED (detalhe)  │ /ieds/{id}         │ ✅ Funcional            │ API real (via Inertia)             │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Telemetria     │ /telemetry         │ ✅ Funcional            │ API real (/telemetry/ultimas)      │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Histórico      │ /telemetry/history │ ✅ Funcional            │ API real (/telemetry/history/ied)  │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Eventos        │ /events            │ ⚠️ Dados mockados       │ Dados hardcoded no componente      │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Oscilografia   │ /oscillography     │ ⚠️ Dados mockados       │ Dados hardcoded no componente      │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Config IEDs    │ /settings/ieds     │ ⚠️ Dados mockados       │ Dados hardcoded no componente      │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Config Agents  │ /settings/agents   │ ⚠️ Dados mockados       │ Dados hardcoded no componente      │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Config Sistema │ /settings/system   │ ⚠️ Parcialmente mockado │ Estrutura ok, sem API              │
├────────────────┼────────────────────┼─────────────────────────┼────────────────────────────────────┤
│ Login          │ /login             │ ⚠️ Legado               │ Funcional mas antigo               │
└────────────────┴────────────────────┴─────────────────────────┴────────────────────────────────────┘

Não existe:
- Página COMTRADE
- Rota /comtrade ou /comtrade/:id

---

4. COMPONENTES REUTILIZÁVEIS EXISTENTES

┌────────────────┬───────────────────────┬────────────────────────────────┐
│   Componente   │          Uso          │           Observação           │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ DataTable      │ Tabelas com paginação │ ✅ Bem implementado, usa fetch │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ OrigemSidebar  │ Menu lateral          │ ✅ Funcional com submenus      │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ LayoutAdmin    │ Layout admin          │ ✅ Funcional                   │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ GreetingBanner │ Saudação              │ ⚠️ Legado,Tailwind puro        │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ StatCard       │ Card de estatísticas  │ ✅ Genérico                    │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ IEDForm        │ Formulário de IED     │ ✅ Funcional                   │
├────────────────┼───────────────────────┼────────────────────────────────┤
│ SelectApi      │ Select com API        │ ✅ Reutilizável                │
└────────────────┴───────────────────────┴────────────────────────────────┘

Componentes legados não utilizados no AMTK:
- Origem_card, Origem_popup, etc. (do projeto OrigemRP)
- MultSelectUsuarios, PessoasLista, TokenLista
- ProdutoLista, SeguradoraLista
- AjaxSumoSelect
- Relogio
- FormataDataHora, DataAmigavel, FormataData

---

5. SERVIÇOS/API EXISTENTES

Endpoints Backend (PHP) Implementados:

┌────────┬─────────────────────────────┬────────────────────────┬────────┐
│ Método │            Rota             │       Descrição        │ Status │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /home-panel-informacoes     │ Dados do dashboard     │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /lista/ieds                 │ Lista paginada de IEDs │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /save/ied (POST)            │ Salvar IED             │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/ieds             │ Lista de IEDs          │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/ultimas          │ Última telemetria      │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/listar           │ Lista paginada         │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/ultima/{id}      │ Última por IED         │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/history/ied/{id} │ Histórico por IED      │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /telemetry/history/ied      │ Histórico por data     │ ✅     │
├────────┼─────────────────────────────┼────────────────────────┼────────┤
│ GET    │ /api/Auth/logar             │ Login                  │ ✅     │
└────────┴─────────────────────────────┴────────────────────────┴────────┘

Endpoints NÃO implementados (dependência da API):

┌────────┬───────────────────────┬──────────────────┐
│ Método │    Rota Necessária    │    Descrição     │
├────────┼───────────────────────┼──────────────────┤
│ GET    │ /api/v1/events        │ Lista de eventos │
├────────┼───────────────────────┼──────────────────┤
│ GET    │ /api/v1/comtrade      │ Lista COMTRADE   │
├────────┼───────────────────────┼──────────────────┤
│ GET    │ /api/v1/comtrade/{id} │ Detalhe COMTRADE │
├────────┼───────────────────────┼──────────────────┤
│ GET    │ /api/v1/agents        │ Lista de agents  │
├────────┼───────────────────────┼──────────────────┤
│ GET    │ /api/v1/settings      │ Configurações    │
└────────┴───────────────────────┴──────────────────┘

---

6. ROTAS EXISTENTES

Web Routes (PHP):

GET  /                           → Dashboard (Home)
GET  /home                       → Dashboard (Home)
GET  /login                      → Login
GET  /ieds                       → Lista IEDs
GET  /ieds/{id}                  → Detalhe IED
GET  /telemetry                  → Telemetria
GET  /telemetry/history          → Histórico
GET  /events                     → Eventos
GET  /oscillography              → Oscilografia
GET  /settings/ieds              → Config IEDs
GET  /settings/agents            → Config Agents
GET  /settings/system            → Config Sistema

Rotas Ausentes:

GET  /comtrade                   → ❌ Não existe
GET  /comtrade/{id}              → ❌ Não existe
GET  /agents                     → ❌ Não existe (rota separada)

---

7. PROBLEMAS ENCONTRADOS

CRÍTICO

┌─────┬─────────────────────────────┬───────────────────────────────────┬────────────────────────────────┐
│  #  │          Problema           │              Arquivo              │            Impacto             │
├─────┼─────────────────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ C1  │ Nome de arquivo com espaço  │ ErrorBoundary .jsx                │ Pode causar erros de import    │
├─────┼─────────────────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ C2  │ Import errado               │ app.jsx:7                         │ ./ErrorBoundary  com espaço    │
├─────┼─────────────────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ C3  │ BrowserRouter desnecessário │ app.jsx:25                        │ Conflito potencial com Inertia │
├─────┼─────────────────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ C4  │ Dados mockados em 5 páginas │ Events, Oscillography, Settings/* │ Dados não reais                │
├─────┼─────────────────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ C5  │ Ausência da página COMTRADE │ —                                 │ Requisito do projeto           │
└─────┴─────────────────────────────┴───────────────────────────────────┴────────────────────────────────┘

ALTO

┌─────┬───────────────────────────────────────────┬─────────────────────┬───────────────────────────┐
│  #  │                 Problema                  │       Arquivo       │          Impacto          │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A1  │ NavBar com chamada hardcoded              │ NavBar.jsx:13       │ /user/listar-usuario-id/1 │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A2  │ GreetingBanner usa Tailwind puro          │ GreetingBanner.jsx  │ Inconsistência visual     │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A3  │ Mistura Bootstrap + Tailwind              │ Todo o projeto      │ Conflitos de estilo       │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A4  │ console.log em produção                   │ Diversos arquivos   │ Vazamento de dados        │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A5  │ Dashboard sem auto-refresh                │ Home/index.jsx      │ Dados não atualizam       │
├─────┼───────────────────────────────────────────┼─────────────────────┼───────────────────────────┤
│ A6  │ Telemetry polling 5s sem cleanup adequado │ Telemetry/index.jsx │ Pode causar memory leak   │
└─────┴───────────────────────────────────────────┴─────────────────────┴───────────────────────────┘

MÉDIO

┌─────┬─────────────────────────────────┬───────────────────────────┬─────────────────────────┐
│  #  │            Problema             │          Arquivo          │         Impacto         │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M1  │ Status badge hardcoded "Online" │ Telemetry/columns.jsx:148 │ Não reflete status real │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M2  │ Bibliotecas não utilizadas      │ package.json              │ Bundle maior            │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M3  │ Dois sistemas de toast          │ package.json              │ Confusão                │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M4  │ Axios + Fetch misturados        │ Diversos                  │ Inconsistência          │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M5  │ Agent hardcoded no IEDForm      │ IEDForm.jsx:293           │ Opção fixa              │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M6  │ Title "OrigemRP" no LayoutAdmin │ LayoutAdmin.jsx:52        │ Nome errado             │
├─────┼─────────────────────────────────┼───────────────────────────┼─────────────────────────┤
│ M7  │ Copyright 2024                  │ LayoutAdmin.jsx:76        │ Ano desatualizado       │
└─────┴─────────────────────────────────┴───────────────────────────┴─────────────────────────┘

BAIXO

┌─────┬───────────────────────────────────┬─────────────────────────────┬──────────────────────────┐
│  #  │             Problema              │           Arquivo           │         Impacto          │
├─────┼───────────────────────────────────┼─────────────────────────────┼──────────────────────────┤
│ B1  │ Componentes legados não removidos │ Components/                 │ Confusão                 │
├─────┼───────────────────────────────────┼─────────────────────────────┼──────────────────────────┤
│ B2  │ Filtro Home não usado             │ Pages/Home/forms/filtro.jsx │ Código morto             │
├─────┼───────────────────────────────────┼─────────────────────────────┼──────────────────────────┤
│ B3  │ greetingHandler.js duplicado      │ utils/ + GreetingBanner     │ Redundância              │
├─────┼───────────────────────────────────┼─────────────────────────────┼──────────────────────────┤
│ B4  │ Tailwind mínimo                   │ app.css                     │ Barely used              │
├─────┼───────────────────────────────────┼─────────────────────────────┼──────────────────────────┤
│ B5  │ jsconfig.json                     │ Raiz                        │ Pode estar desatualizado │
└─────┴───────────────────────────────────┴─────────────────────────────┴──────────────────────────┘

INFO

┌─────┬──────────────────────────────────────────────┬───────────────────────┐
│  #  │                  Observação                  │        Arquivo        │
├─────┼──────────────────────────────────────────────┼───────────────────────┤
│ I1  │ Backend PHP customizado (não Laravel full)   │ OrigemPHP/            │
├─────┼──────────────────────────────────────────────┼───────────────────────┤
│ I2  │ BaseController usa Blade + Inertia misturado │ BaseController.php    │
├─────┼──────────────────────────────────────────────┼───────────────────────┤
│ I3  │ Sessão hardcode (user id=1)                  │ Todos os serviços PHP │
├─────┼──────────────────────────────────────────────┼───────────────────────┤
│ I4  │ Template base: Sneat Admin Template          │ public/assets/        │
├─────┼──────────────────────────────────────────────┼───────────────────────┤
│ I5  │ Rota /agents no sidebar mas sem página       │ OrigemSidebar.jsx     │
└─────┴──────────────────────────────────────────────┴───────────────────────┘

---

8. DUPLICAÇÕES

1. Cálculo de telemetrySummary — duplicado entre Home/index.jsx e Telemetry/index.jsx
2. Função getStatus() — duplicada em Settings/IEDs, Settings/Agents, Oscillography, Events
3. Função formatResponseTime() — duplicada em Settings/IEDs e Settings/Agents
4. Função formatNumber() — duplicada em Telemetry/History e Oscillography
5. Dados mockados de IEDs — repetidos em Settings/IEDs, Events, Oscillography
6. Rota /telemetry/ieds — registrada duas vezes em api/Rotas.php:40-58

---

9. PONTOS QUE PRECISAM DE INTEGRAÇÃO COM API

┌──────────────────┬───────────────────────┬─────────────────────┐
│      Página      │  Endpoint Necessário  │       Método        │
├──────────────────┼───────────────────────┼─────────────────────┤
│ Eventos          │ /api/v1/events        │ GET                 │
├──────────────────┼───────────────────────┼─────────────────────┤
│ Config IEDs      │ /api/v1/ieds          │ GET/POST/PUT/DELETE │
├──────────────────┼───────────────────────┼─────────────────────┤
│ Config Agents    │ /api/v1/agents        │ GET/POST/PUT/DELETE │
├──────────────────┼───────────────────────┼─────────────────────┤
│ Config Sistema   │ /api/v1/settings      │ GET/PUT             │
├──────────────────┼───────────────────────┼─────────────────────┤
│ COMTRADE (nova)  │ /api/v1/comtrade      │ GET                 │
├──────────────────┼───────────────────────┼─────────────────────┤
│ COMTRADE detalhe │ /api/v1/comtrade/{id} │ GET                 │
└──────────────────┴───────────────────────┴─────────────────────┘

---

10. DEPENDÊNCIAS DO BACKEND

- Tabela ieds — OK, implementada
- Tabela telemetry — OK, implementada
- Tabela events — OK, mas sem endpoint de listagem no frontend
- Tabela agents — OK, mas sem endpoint de listagem
- Tabela comtrade_records — ❌ Não existe no backend ainda
- Tabela comtrade_channels — ❌ Não existe no backend ainda
- Tabela comtrade_samples — ❌ Não existe no backend ainda

---

11. RISCOS TÉCNICOS

1. Inertia.js v0.2.5 (PHP) — Versão antiga, pode ter incompatibilidades
2. BrowserRouter + Inertia — Pode causar conflitos de roteamento
3. Bootstrap + Tailwind — Conflitos de CSS possíveis
4. Muitas dependências não utilizadas — Aumenta tempo de build
5. Memory leaks — Polling sem cleanup adequado
6. console.log em produção — Vazamento de informações sensíveis

---

12. RESUMO EXECUTIVO

✅ O que está funcionando bem:

- Dashboard com dados reais da API
- Lista de IEDs com DataTable funcional
- Detalhe do IED
- Telemetria em tempo real com auto-refresh
- Histórico de telemetria com filtros
- Layout admin com sidebar funcional
- Componente DataTable reutilizável
- Tratamento de null/undefined nos cards

⚠️ O que precisa de ajuste:

- 5 páginas com dados mockados precisam de integração API
- Página COMTRADE precisa ser criada
- Navbar e componentes legados precisam ser limpos
- Nomes de arquivos com espaços
- Console.logs removidos
- Título "OrigemRP" corrigido para "AMTK"
- Bibliotecas não utilizadas removidas

❌ O que não existe:

- Página COMTRADE
- Endpoint de eventos no frontend
- Endpoint de agents no frontend
- Configurações do sistema via API

---

Fim da ETAPA 1 — AUDITORIA

Aguardando autorização para prosseguir com a ETAPA 2 — CLASSIFICAÇÃO e ETAPA 3 — PLANO.

✻ Baked for 4m 39s · done 11:17 PM

※ recap: Fiz a auditoria completa do frontend AMTK, mapeando todas as páginas, componentes, rotas e problemas encontrados. O próximo passo é apresentar a ETAPA 2 (classificação dos problemas por severidade) e a ETAPA 3 (plano de execução) para sua aprovação antes de alterar qualquer código. (disable recaps in /config)

────────────





RELATÓRIO DE AUDITORIA — AMTK FRONTEND

---

A. ESTRUTURA ENCONTRADA

C:\laragon\www\AMTK\
├── resources/
│   ├── js/
│   │   ├── app.jsx                          # Ponto de entrada Inertia
│   │   ├── bootstrap.js                     # Configuração axios
│   │   ├── ErrorBoundary .jsx               # ⚠️ NOME COM ESPAÇO
│   │   │
│   │   ├── Components/
│   │   │   ├── DataTable.jsx                # ✅ Tabela reutilizável
│   │   │   ├── OrigemSidebar.jsx            # ✅ Sidebar do AMTK
│   │   │   ├── StatCard.jsx                 # ✅ Card genérico
│   │   │   ├── SelectApi.jsx                # ✅ Select com API
│   │   │   ├── NavBar.jsx                   # ⚠️ Legado (Outro projeto)
│   │   │   ├── GreetingBanner.jsx           # ⚠️ Legado (Tailwind puro)
│   │   │   ├── AjaxSumoSelect.jsx           # ⚠️ Legado
│   │   │   ├── Relogio.jsx                  # ⚠️ Legado
│   │   │   ├── FormataData.jsx              # ⚠️ Legado
│   │   │   ├── FormataDataHora.jsx          # ⚠️ Legado
│   │   │   ├── DataAmigavel.jsx             # ⚠️ Legado
│   │   │   ├── Usuarios.jsx                 # ⚠️ Legado
│   │   │   ├── MultSelectUsuarios.jsx       # ⚠️ Legado
│   │   │   ├── TokenLista.jsx               # ⚠️ Legado
│   │   │   ├── PessoasLista.jsx             # ⚠️ Legado
│   │   │   ├── ProdutoLista.jsx             # ⚠️ Legado
│   │   │   ├── ProdutoListaNome.jsx         # ⚠️ Legado
│   │   │   ├── SeguradoraLista.jsx          # ⚠️ Legado
│   │   │   ├── ProgressBar.jsx              # ⚠️ Legado
│   │   │   ├── IconsTool.jsx                # ⚠️ Legado
│   │   │   ├── UploadImagem.jsx             # ⚠️ Legado
│   │   │   ├── DynamicInputs.jsx            # ⚠️ Legado
│   │   │   ├── OrigemEditor.jsx             # ⚠️ Legado
│   │   │   ├── Origem_Offcanvas.jsx         # ⚠️ Legado
│   │   │   ├── NavForm.jsx                  # ⚠️ Legado
│   │   │   ├── WizardWrapper.jsx            # ⚠️ Legado
│   │   │   ├── LineChart.jsx                # ⚠️ Legado
│   │   │   ├── MiniStatCard.jsx             # ⚠️ Legado
│   │   │   ├── AreaLineChart.jsx            # ⚠️ Legado
│   │   │   ├── MotivationMessage.jsx        # ⚠️ Legado
│   │   │   ├── wizard/ (5 arquivos)         # ⚠️ Legado
│   │   │   └── ksi/ (10 arquivos)           # ⚠️ Legado
│   │   │
│   │   ├── Layouts/
│   │   │   ├── LayoutAdmin.jsx              # ✅ Layout principal
│   │   │   └── GuestLAyout.jsx              # ⚠️ Legado
│   │   │
│   │   ├── Pages/
│   │   │   ├── Home/
│   │   │   │   ├── index.jsx                # ✅ Dashboard
│   │   │   │   └── forms/filtro.jsx         # ⚠️ Legado (não usado)
│   │   │   ├── IED/
│   │   │   │   ├── index.jsx                # ✅ Lista IEDs
│   │   │   │   ├── columns.jsx              # ✅ Colunas tabela
│   │   │   │   ├── IEDForm.jsx              # ✅ Formulário IED
│   │   │   │   └── Show/index.jsx           # ✅ Detalhe IED
│   │   │   ├── Telemetry/
│   │   │   │   ├── index.jsx                # ✅ Telemetria realtime
│   │   │   │   ├── columns.jsx              # ✅ Colunas telemetria
│   │   │   │   └── History/index.jsx        # ✅ Histórico
│   │   │   ├── Events/index.jsx             # ⚠️ Dados mockados
│   │   │   ├── Oscillography/index.jsx      # ⚠️ Dados mockados
│   │   │   ├── Settings/
│   │   │   │   ├── IEDs/index.jsx           # ⚠️ Dados mockados
│   │   │   │   ├── Agents/index.jsx         # ⚠️ Dados mockados
│   │   │   │   └── System/index.jsx         # ⚠️ Parcialmente mockado
│   │   │   └── Login/Login.jsx              # ⚠️ Legado
│   │   │
│   │   └── utils/
│   │       └── greetingHandler.js           # ⚠️ Legado/duplicado
│   │
│   ├── css/
│   │   ├── app.css                          # Tailwind mínimo
│   │   └── partial.css
│   │
│   └── views/
│       └── app.blade.php                    # Template Inertia
│
├── OrigemPHP/
│   ├── Config/
│   │   ├── BaseController.php               # renderInertia()
│   │   ├── Router.php
│   │   ├── Connection.php
│   │   ├── Middleware/ (8 arquivos)
│   │   └── ...
│   ├── Rotas/
│   │   ├── main.php                         # Entrada rotas
│   │   ├── Rotas.php                        # Rotas auth/login
│   │   ├── web/Rotas.php                    # Rotas web
│   │   └── api/Rotas.php                    # Rotas API
│   ├── Servicos/
│   │   ├── Home/Home.php
│   │   ├── IED/Ieds.php
│   │   ├── Telemetry/Telemetry.php
│   │   ├── Telemetry/History.php
│   │   ├── Events/Events.php
│   │   ├── Oscillography/Oscillography.php
│   │   ├── Settings/Settings.php
│   │   └── Usuarios/Usuarios.php
│   └── Models/
│       ├── IED.php
│       ├── Telemetry.php
│       ├── Agent.php
│       └── Event.php
│
├── public/
│   └── assets/                              # Sneat Admin Template
│       ├── vendor/css/
│       ├── vendor/js/
│       ├── css/
│       └── js/
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── composer.json
├── index.php
└── config.php

---

B. TELAS EXISTENTES

B.1 Dashboard (/ ou /home)

Arquivo: resources/js/Pages/Home/index.jsx
Status:  ✅ FUNCIONAL COM API

┌─────────────────────┬────────┬─────────────────────────────────────────┐
│       Aspecto       │ Status │               Observação                │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Cards/resumo        │ ✅     │ 4 cards: IEDs, Online, Offline, Eventos │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Telemetria resumida │ ✅     │ Corrente, Tensão, Potência              │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Conectividade       │ ✅     │ Lista de IEDs com status                │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Tabela IEDs         │ ✅     │ Telemetria em tempo real                │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Eventos recentes    │ ✅     │ Lista de eventos                        │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Loading             │ ✅     │ Estado de carregamento                  │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Error               │ ✅     │ Mensagem de erro                        │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Valores null        │ ✅     │ Tratado com ?? e toLocaleString         │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Auto-refresh        │ ❌     │ NÃO possui (diferente da Telemetry)     │
├─────────────────────┼────────┼─────────────────────────────────────────┤
│ Gráficos            │ ❌     │ Não implementados                       │
└─────────────────────┴────────┴─────────────────────────────────────────┘

Endpoint utilizado: GET /home-panel-informacoes

Problemas:
- Sem atualização automática
- Eventos exibem apenas event.message sem formatação adequada
- Texto ".." aparece nos cards de corrente e potência (linhas 279, 335)
- Não há tratamento para quando o backend retornar erro

---

B.2 Lista de IEDs (/ieds)

Arquivo: resources/js/Pages/IED/index.jsx
Status:  ✅ FUNCIONAL COM API

┌─────────────┬────────┬──────────────────────────────────┐
│   Aspecto   │ Status │            Observação            │
├─────────────┼────────┼──────────────────────────────────┤
│ Listagem    │ ✅     │ Via DataTable + API              │
├─────────────┼────────┼──────────────────────────────────┤
│ Resumo      │ ✅     │ Total, Online, Discovery, Manual │
├─────────────┼────────┼──────────────────────────────────┤
│ Busca       │ ✅     │ Via DataTable                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Paginação   │ ✅     │ Via DataTable                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Ordenação   │ ✅     │ Via DataTable                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Cadastro    │ ✅     │ Modal IEDForm                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Edição      │ ✅     │ Modal IEDForm                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Discovery   │ ⚠️     │ Modal existe mas não funcional   │
├─────────────┼────────┼──────────────────────────────────┤
│ Loading     │ ✅     │ Via DataTable                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Empty state │ ✅     │ Via DataTable                    │
├─────────────┼────────┼──────────────────────────────────┤
│ Detalhes    │ ✅     │ Link para /ieds/{id}             │
└─────────────┴────────┴──────────────────────────────────┘

Endpoints utilizados:
- GET /lista/ieds — DataTable
- POST /save/ied — Cadastro/edição

Problemas:
- iedResumo.status pode estar confuso (mostra quantidade online, não o campo)
- Botão "Iniciar Discovery" não possui handler
- Após salvar, setShowModal(true) deveria ser false
- agents não é passado para IEDForm (comentado na linha 241)
- O IEDForm exige agent_id mas a lista de agents não é carregada

---

B.3 Detalhe do IED (/ieds/{id})

Arquivo: resources/js/Pages/IED/Show/index.jsx
Status:  ✅ FUNCIONAL COM API

┌───────────────┬────────┬──────────────────────────────────────┐
│    Aspecto    │ Status │              Observação              │
├───────────────┼────────┼──────────────────────────────────────┤
│ Identificação │ ✅     │ ID, Nome, Fabricante, Modelo         │
├───────────────┼────────┼──────────────────────────────────────┤
│ Status        │ ✅     │ Online/Offline                       │
├───────────────┼────────┼──────────────────────────────────────┤
│ Comunicação   │ ✅     │ Host, Porta, Protocolo               │
├───────────────┼────────┼──────────────────────────────────────┤
│ Agent         │ ✅     │ Nome, Versão, ID                     │
├───────────────┼────────┼──────────────────────────────────────┤
│ Monitoramento │ ✅     │ Verificações, Falhas, Última leitura │
├───────────────┼────────┼──────────────────────────────────────┤
│ Alerta falhas │ ✅     │ Condição exibida                     │
├───────────────┼────────┼──────────────────────────────────────┤
│ Botão editar  │ ⚠️     │ Botão existe mas não tem ação        │
├───────────────┼────────┼──────────────────────────────────────┤
│ Botão voltar  │ ✅     │ Redireciona para /settings/ieds      │
├───────────────┼────────┼──────────────────────────────────────┤
│ Loading       │ ❌     │ Não possui                           │
├───────────────┼────────┼──────────────────────────────────────┤
│ Error         │ ❌     │ Não possui                           │
└───────────────┴────────┴──────────────────────────────────────┘

Problemas:
- Botão "Editar IED" não possui onClick
- Redirecionamento do botão voltar vai para /settings/ieds em vez de /ieds
- Sem tratamento para IED não encontrado (exciso no backend)
- Sem loading skeleton

---

B.4 Telemetria (/telemetry)

Arquivo: resources/js/Pages/Telemetry/index.jsx
Status:  ✅ FUNCIONAL COM API

┌──────────────┬────────┬────────────────────────────────────────┐
│   Aspecto    │ Status │               Observação               │
├──────────────┼────────┼────────────────────────────────────────┤
│ Seleção IED  │ ✅     │ Select carregado da API                │
├──────────────┼────────┼────────────────────────────────────────┤
│ Filtros      │ ✅     │ IED + Pesquisa                         │
├──────────────┼────────┼────────────────────────────────────────┤
│ Auto-refresh │ ✅     │ 5 segundos (configurável)              │
├──────────────┼────────┼────────────────────────────────────────┤
│ Cards resumo │ ✅     │ Corrente, Tensão, Potência, Frequência │
├──────────────┼────────┼────────────────────────────────────────┤
│ Tabela       │ ✅     │ Via DataTable                          │
├──────────────┼────────┼────────────────────────────────────────┤
│ Valores null │ ✅     │ Tratados                               │
├──────────────┼────────┼────────────────────────────────────────┤
│ toFixed()    │ ✅     │ Seguro                                 │
├──────────────┼────────┼────────────────────────────────────────┤
│ Loading      │ ✅     │ Estado implementado                    │
├──────────────┼────────┼────────────────────────────────────────┤
│ Error        │ ✅     │ Mensagem exibida                       │
├──────────────┼────────┼────────────────────────────────────────┤
│ Empty state  │ ✅     │ Nenhum IED disponível                  │
└──────────────┴────────┴────────────────────────────────────────┘

Endpoints utilizados:
- GET /telemetry/ieds — Lista de IEDs
- GET /telemetry/ultimas — Última telemetria
- GET /telemetry/listar — DataTable paginada

Problemas:
- console.log nas linhas 352-353 (vazamento em produção)
- Auto-refresh a cada 5s pode ser agressivo para muitos IEDs
- selectedIed não é usado para filtrar a DataTable (só filtra o filteredTelemetry do card)
- summary não inclui frequency (só calcula na primeira iteração)

---

B.5 Histórico (/telemetry/history)

Arquivo: resources/js/Pages/Telemetry/History/index.jsx
Status:  ✅ FUNCIONAL COM API

┌──────────────────┬────────┬───────────────────────────────┐
│     Aspecto      │ Status │          Observação           │
├──────────────────┼────────┼───────────────────────────────┤
│ Filtro IED       │ ✅     │ Select carregado da API       │
├──────────────────┼────────┼───────────────────────────────┤
│ Filtro período   │ ✅     │ Data inicial + final          │
├──────────────────┼────────┼───────────────────────────────┤
│ Consultar        │ ✅     │ Botão dispara busca           │
├──────────────────┼────────┼───────────────────────────────┤
│ Tabela           │ ✅     │ Tabela nativa (não DataTable) │
├──────────────────┼────────┼───────────────────────────────┤
│ Resumo           │ ✅     │ Corrente, Tensão, Frequência  │
├──────────────────┼────────┼───────────────────────────────┤
│ Formatação datas │ ✅     │ Múltiplos formatos suportados │
├──────────────────┼────────┼───────────────────────────────┤
│ Empty state      │ ✅     │ Mensagem adequada             │
├──────────────────┼────────┼───────────────────────────────┤
│ Loading          │ ✅     │ Estado implementado           │
├──────────────────┼────────┼───────────────────────────────┤
│ Error            │ ✅     │ Mensagem exibida              │
├──────────────────┼────────┼───────────────────────────────┤
│ Paginação        │ ❌     │ Não implementada              │
├──────────────────┼────────┼───────────────────────────────┤
│ Exportar         │ ⚠️     │ Botão existe mas sem ação     │
└──────────────────┴────────┴───────────────────────────────┘

Endpoints utilizados:
- GET /telemetry/ieds — Lista de IEDs
- GET /telemetry/history/ied/{id} — Histórico por IED
- GET /telemetry/history/ied — Histórico por data

Problemas:
- console.log(records) na linha 155 (vazamento em produção)
- Tabela não utiliza DataTable (código duplicado)
- Sem paginação (carrega todos os registros)
- Botão "Exportar" desabilitado quando não há registros mas sem ação
- handleSearch deveria exigir seleção de IED ou período

---

B.6 Eventos (/events)

Arquivo: resources/js/Pages/Events/index.jsx
Status:  ⚠️ DADOS MOCKADOS

┌───────────────────┬────────┬──────────────────────────────────────────────┐
│      Aspecto      │ Status │                  Observação                  │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Lista eventos     │ ⚠️     │ 5 eventos hardcoded                          │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Filtros           │ ✅     │ IED, Severidade, Status, Período             │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Resumo            │ ✅     │ Total, Ativos, Críticos, Atenção, Resolvidos │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Tabela            │ ✅     │ Tabela nativa                                │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Badges severidade │ ✅     │ Crítico, Atenção, Informação                 │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Badges status     │ ✅     │ Ativo, Resolvido                             │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Loading           │ ❌     │ Não implementado                             │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Error             │ ❌     │ Não implementado                             │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Empty state       │ ✅     │ "Nenhum evento encontrado"                   │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ Paginação         │ ❌     │ Não implementada                             │
├───────────────────┼────────┼──────────────────────────────────────────────┤
│ API               │ ❌     │ Dados mockados                               │
└───────────────────┴────────┴──────────────────────────────────────────────┘

Problemas:
- DADOS COMPLETAMENTE MOCKADOS — não consome API
- Lista de IEDs nos filtros hardcoded
- Sem integração com backend
- Não há endpoint de eventos implementado no backend para listagem

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/events — Lista de eventos com paginação
- Parâmetros: page, per_page, ied_id, status, severity, data_inicial, data_final

---

B.7 Oscilografia (/oscillography)

Arquivo: resources/js/Pages/Oscillography/index.jsx
Status:  ⚠️ DADOS MOCKADOS

┌─────────────────┬────────┬────────────────────────────────────────────┐
│     Aspecto     │ Status │                 Observação                 │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Lista registros │ ⚠️     │ 4 registros hardcoded                      │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Filtros         │ ✅     │ IED, Tipo, Status, Período                 │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Resumo          │ ✅     │ Total, Disponíveis, Faltas, Perturbações   │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Tabela          │ ✅     │ Tabela nativa                              │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Badges tipo     │ ✅     │ Falta, Perturbação, Evento                 │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Badges status   │ ✅     │ Disponível, Indisponível                   │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Ações           │ ⚠️     │ Visualizar e Download (console.log apenas) │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Loading         │ ❌     │ Não implementado                           │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ Error           │ ❌     │ Não implementado                           │
├─────────────────┼────────┼────────────────────────────────────────────┤
│ API             │ ❌     │ Dados mockados                             │
└─────────────────┴────────┴────────────────────────────────────────────┘

Problemas:
- DADOS COMPLETAMENTE MOCKADOS
- Lista de IEDs hardcoded
- Sem integração com backend
- Botões de ação sem funcionalidade

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/oscillography — Lista de registros oscilográficos
- GET /api/v1/oscillography/{id} — Detalhe do registro

---

B.8 Config IEDs (/settings/ieds)

Arquivo: resources/js/Pages/Settings/IEDs/index.jsx
Status:  ⚠️ DADOS MOCKADOS

┌────────────────┬────────┬──────────────────────────────┐
│    Aspecto     │ Status │          Observação          │
├────────────────┼────────┼──────────────────────────────┤
│ Listagem       │ ⚠️     │ 3 IEDs hardcoded             │
├────────────────┼────────┼──────────────────────────────┤
│ Filtros        │ ✅     │ Pesquisa + Status            │
├────────────────┼────────┼──────────────────────────────┤
│ Resumo         │ ✅     │ Total, Online, Offline, Erro │
├────────────────┼────────┼──────────────────────────────┤
│ Cadastro       │ ✅     │ Modal funcional              │
├────────────────┼────────┼──────────────────────────────┤
│ Edição         │ ✅     │ Modal funcional              │
├────────────────┼────────┼──────────────────────────────┤
│ Exclusão       │ ✅     │ window.confirm               │
├────────────────┼────────┼──────────────────────────────┤
│ Toggle ativo   │ ✅     │ Switch funcional             │
├────────────────┼────────┼──────────────────────────────┤
│ Testar conexão │ ⚠️     │ console.log apenas           │
├────────────────┼────────┼──────────────────────────────┤
│ Loading        │ ❌     │ Não implementado             │
├────────────────┼────────┼──────────────────────────────┤
│ Error          │ ❌     │ Não implementado             │
├────────────────┼────────┼──────────────────────────────┤
│ API            │ ❌     │ Dados mockados               │
└────────────────┴────────┴──────────────────────────────┘

Problemas:
- DADOS COMPLETAMENTE MOCKADOS
- CRUD opera apenas no estado local (useState)
- Não persiste alterações na API

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/ieds — Lista de IEDs
- POST /api/v1/ieds — Cadastrar IED
- PUT /api/v1/ieds/{id} — Editar IED
- DELETE /api/v1/ieds/{id} — Excluir IED
- POST /api/v1/ieds/{id}/test — Testar conexão

---

B.9 Config Agents (/settings/agents)

Arquivo: resources/js/Pages/Settings/Agents/index.jsx
Status:  ⚠️ DADOS MOCKADOS

┌────────────────┬────────┬──────────────────────────────┐
│    Aspecto     │ Status │          Observação          │
├────────────────┼────────┼──────────────────────────────┤
│ Listagem       │ ⚠️     │ 3 agents hardcoded           │
├────────────────┼────────┼──────────────────────────────┤
│ Filtros        │ ✅     │ Pesquisa + Status            │
├────────────────┼────────┼──────────────────────────────┤
│ Resumo         │ ✅     │ Total, Online, Offline, Erro │
├────────────────┼────────┼──────────────────────────────┤
│ Cadastro       │ ✅     │ Modal funcional              │
├────────────────┼────────┼──────────────────────────────┤
│ Edição         │ ✅     │ Modal funcional              │
├────────────────┼────────┼──────────────────────────────┤
│ Exclusão       │ ✅     │ window.confirm               │
├────────────────┼────────┼──────────────────────────────┤
│ Toggle ativo   │ ✅     │ Switch funcional             │
├────────────────┼────────┼──────────────────────────────┤
│ Testar conexão │ ⚠️     │ console.log apenas           │
├────────────────┼────────┼──────────────────────────────┤
│ Loading        │ ❌     │ Não implementado             │
├────────────────┼────────┼──────────────────────────────┤
│ Error          │ ❌     │ Não implementado             │
├────────────────┼────────┼──────────────────────────────┤
│ API            │ ❌     │ Dados mockados               │
└────────────────┴────────┴──────────────────────────────┘

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/agents — Lista de agents
- POST /api/v1/agents — Cadastrar agent
- PUT /api/v1/agents/{id} — Editar agent
- DELETE /api/v1/agents/{id} — Excluir agent
- POST /api/v1/agents/{id}/test — Testar conexão

---

B.10 Config Sistema (/settings/system)

Arquivo: resources/js/Pages/Settings/System/index.jsx
Status:  ⚠️ PARCIALMENTE MOCKADO

┌──────────────────┬────────┬────────────────────────────────┐
│     Aspecto      │ Status │           Observação           │
├──────────────────┼────────┼────────────────────────────────┤
│ Identificação    │ ✅     │ Nome, Descrição                │
├──────────────────┼────────┼────────────────────────────────┤
│ Coleta           │ ✅     │ Intervalo, Timeout, Tentativas │
├──────────────────┼────────┼────────────────────────────────┤
│ Telemetria       │ ✅     │ Intervalo, Retenção            │
├──────────────────┼────────┼────────────────────────────────┤
│ Eventos          │ ✅     │ Retenção                       │
├──────────────────┼────────┼────────────────────────────────┤
│ Comunicação      │ ✅     │ Agent Timeout, API Timeout     │
├──────────────────┼────────┼────────────────────────────────┤
│ Regionalização   │ ✅     │ Fuso horário, Idioma           │
├──────────────────┼────────┼────────────────────────────────┤
│ Segurança        │ ✅     │ Timeout sessão                 │
├──────────────────┼────────┼────────────────────────────────┤
│ Modo manutenção  │ ✅     │ Switch                         │
├──────────────────┼────────┼────────────────────────────────┤
│ Salvar           │ ⚠️     │ setTimeout fake (600ms)        │
├──────────────────┼────────┼────────────────────────────────┤
│ Restaurar padrão │ ✅     │ window.confirm                 │
├──────────────────┼────────┼────────────────────────────────┤
│ API              │ ❌     │ Dados mockados                 │
└──────────────────┴────────┴────────────────────────────────┘

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/settings — Carregar configurações
- PUT /api/v1/settings — Salvar configurações

---

B.11 COMTRADE — NÃO EXISTE

Status:  ❌ NÃO IMPLEMENTADO

Necessário criar:
- Rota PHP: GET /comtrade
- Rota PHP: GET /comtrade/{id}
- Serviço PHP: Comtrade.php
- Página React: Pages/Comtrade/index.jsx
- Página React: Pages/Comtrade/Show/index.jsx

DEPENDÊNCIA DO BACKEND:
- GET /api/v1/comtrade — Lista de registros
- GET /api/v1/comtrade/{id} — Detalhe do registro

---

B.12 Login (/login)

Arquivo: resources/js/Pages/Login/Login.jsx
Status:  ⚠️ LEGADO

┌──────────────────┬────────┬──────────────────────────┐
│     Aspecto      │ Status │        Observação        │
├──────────────────┼────────┼──────────────────────────┤
│ Formulário       │ ✅     │ Email + Senha            │
├──────────────────┼────────┼──────────────────────────┤
│ Autenticação     │ ✅     │ POST /api/Auth/logar     │
├──────────────────┼────────┼──────────────────────────┤
│ Token            │ ✅     │ Armazena no localStorage │
├──────────────────┼────────┼──────────────────────────┤
│ Erro             │ ✅     │ Alert Bootstrap          │
├──────────────────┼────────┼──────────────────────────┤
│ Logo             │ ✅     │ Carregado de config      │
├──────────────────┼────────┼──────────────────────────┤
│ Redirecionamento │ ✅     │ /home                    │
└──────────────────┴────────┴──────────────────────────┘

Problemas:
- Usa react-bootstrap (diferente do resto do projeto)
- Usa axios (diferente do fetch do resto)
- console.log(config.logo) na linha 23
- Não usa o padrão visual do AMTK

---

C. COMPONENTES EXISTENTES

Componentes Utilizados pelo AMTK

┌───────────────┬──────────────────────────────┬───────────────────────────────────┬─────────────────────┐
│  Componente   │           Arquivo            │              Função               │       Status        │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ DataTable     │ Components/DataTable.jsx     │ Tabela com paginação, busca, sort │ ✅ Bem implementado │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ OrigemSidebar │ Components/OrigemSidebar.jsx │ Menu lateral                      │ ✅ Funcional        │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ LayoutAdmin   │ Layouts/LayoutAdmin.jsx      │ Layout admin                      │ ✅ Funcional        │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ StatCard      │ Components/StatCard.jsx      │ Card de estatísticas              │ ✅ Genérico         │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ SelectApi     │ Components/SelectApi.jsx     │ Select com carregamento API       │ ✅ Reutilizável     │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ IEDForm       │ Pages/IED/IEDForm.jsx        │ Formulário de IED                 │ ✅ Funcional        │
├───────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┤
│ ErrorBoundary │ ErrorBoundary .jsx           │ Captura de erros                  │ ✅ Funcional        │
└───────────────┴──────────────────────────────┴───────────────────────────────────┴─────────────────────┘

Componentes Legados (NÃO utilizados pelo AMTK)

Components/NavBar.jsx
Components/GreetingBanner.jsx
Components/AjaxSumoSelect.jsx
Components/Relogio.jsx
Components/FormataData.jsx
Components/FormataDataHora.jsx
Components/DataAmigavel.jsx
Components/Usuarios.jsx
Components/MultSelectUsuarios.jsx
Components/TokenLista.jsx
Components/PessoasLista.jsx
Components/ProdutoLista.jsx
Components/ProdutoListaNome.jsx
Components/SeguradoraLista.jsx
Components/ProgressBar.jsx
Components/IconsTool.jsx
Components/UploadImagem.jsx
Components/DynamicInputs.jsx
Components/OrigemEditor.jsx
Components/Origem_Offcanvas.jsx
Components/NavForm.jsx
Components/WizardWrapper.jsx
Components/LineChart.jsx
Components/MiniStatCard.jsx
Components/AreaLineChart.jsx
Components/MotivationMessage.jsx
Components/wizard/* (5 arquivos)
Components/ksi/* (10 arquivos)

---

D. INTEGRAÇÃO COM API

D.1 Endpoints Implementados

┌────────┬─────────────────────────────┬─────────────────────────────────┬───────────────────────────┬──────────────┐
│ Método │            Rota             │            Frontend             │      Backend Service      │    Status    │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /home-panel-informacoes     │ Home/index.jsx                  │ Home::informacoes()       │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /lista/ieds                 │ IED/index.jsx (DataTable)       │ Ieds::listaIeds()         │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ POST   │ /save/ied                   │ IED/IEDForm.jsx                 │ Ieds::sava()              │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/ieds             │ Telemetry, History              │ Telemetry::ieds()         │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/ultimas          │ Telemetry/index.jsx             │ Telemetry::ultimas()      │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/listar           │ Telemetry/index.jsx (DataTable) │ Telemetry::listar()       │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/ultima/{id}      │ —                               │ Telemetry::ultimaPorIed() │ ✅ Não usado │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/history/ied/{id} │ History/index.jsx               │ History::historicoIed()   │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /telemetry/history/ied      │ History/index.jsx               │ History::historicoData()  │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ GET    │ /login                      │ Login/Login.jsx                 │ Autentica::login()        │ ✅           │
├────────┼─────────────────────────────┼─────────────────────────────────┼───────────────────────────┼──────────────┤
│ POST   │ /api/Auth/logar             │ Login/Login.jsx                 │ Auth::login()             │ ✅           │
└────────┴─────────────────────────────┴─────────────────────────────────┴───────────────────────────┴──────────────┘

D.2 Endpoints Ausentes (Backend necessário)

┌────────┬───────────────────────┬──────────────────────┬────────┐
│ Método │         Rota          │   Necessário Para    │ Status │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ GET    │ /api/v1/events        │ Events/index.jsx     │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ GET    │ /api/v1/agents        │ Settings/Agents, IED │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ POST   │ /api/v1/agents        │ Settings/Agents      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ PUT    │ /api/v1/agents/{id}   │ Settings/Agents      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ DELETE │ /api/v1/agents/{id}   │ Settings/Agents      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ GET    │ /api/v1/comtrade      │ Comtrade (nova)      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ GET    │ /api/v1/comtrade/{id} │ Comtrade (nova)      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ GET    │ /api/v1/settings      │ Settings/System      │ ❌     │
├────────┼───────────────────────┼──────────────────────┼────────┤
│ PUT    │ /api/v1/settings      │ Settings/System      │ ❌     │
└────────┴───────────────────────┴──────────────────────┴────────┘

D.3 Padrão de Chamadas HTTP

// PADRÃO 1: fetch ( maioria das telas )
const response = await fetch("/endpoint", {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    }
});

// PADRÃO 2: axios (Login, IED save)
const resp = await axios.post('/save/ied', data);

Problemas:
- Dois padrões misturados (fetch + axios)
- Sem camada de serviços centralizada
- Sem interceptors
- Sem tratamento统一 de erros HTTP (401, 403, 404, 500)
- Sem cancelamento de requisições (AbortController)

---

E. PROBLEMAS CLASSIFICADOS

CRÍTICO

┌─────┬─────────────────────────────────┬─────────────────────┬──────────────────────────────────────────────────────────────┬─────────────────────────────────┐
│  #  │            Problema             │     Arquivo(s)      │                           Impacto                            │            Correção             │
├─────┼─────────────────────────────────┼─────────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┤
│ C1  │ Nome de arquivo com espaço      │ ErrorBoundary .jsx  │ Pode causar erro de import em ambientes que normalizam nomes │ Renomear para ErrorBoundary.jsx │
├─────┼─────────────────────────────────┼─────────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┤
│ C2  │ Import com espaço no nome       │ app.jsx:7           │ Erro Element type is invalid                                 │ Atualizar import                │
├─────┼─────────────────────────────────┼─────────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┤
│ C3  │ BrowserRouter junto com Inertia │ app.jsx:8,25        │ Conflito de roteamento, react-router-dom carregado à toa     │ Remover BrowserRouter           │
├─────┼─────────────────────────────────┼─────────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────────┤
│ C4  │ Rota /telemetry/ieds duplicada  │ api/Rotas.php:40-58 │ A rota está registrada duas vezes                            │ Remover duplicata               │
└─────┴─────────────────────────────────┴─────────────────────┴──────────────────────────────────────────────────────────────┴─────────────────────────────────┘

ALTO

┌─────┬──────────────────────────────────┬───────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────┐
│  #  │             Problema             │            Arquivo(s)             │               Impacto                │             Correção             │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A1  │ 5 telas com dados mockados       │ Events, Oscillography, Settings/* │ Dados não reais, CRUD infuncional    │ Criar endpoints + integrar       │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A2  │ Página COMTRADE inexistente      │ —                                 │ Requisito do projeto não atendido    │ Criar página + rotas             │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A3  │ NavBar.jsx com chamada hardcoded │ NavBar.jsx:13                     │ /user/listar-usuario-id/1 não existe │ Remover componente legado        │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A4  │ Title "OrigemRP"                 │ LayoutAdmin.jsx:52                │ Nome errado do projeto               │ Alterar para "AMTK"              │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A5  │ agent_id hardcoded no IEDForm    │ IEDForm.jsx:293                   │ Só mostra um agent fixo              │ Carregar agents da API           │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A6  │ agents não passado ao IEDForm    │ IED/index.jsx:241                 │ Select de agent vazio                │ Buscar agents + passar como prop │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A7  │ IEDs\Config: CRUD só local       │ Settings/IEDs/index.jsx           │ Alterações não persistem             │ Integrar com API                 │
├─────┼──────────────────────────────────┼───────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
│ A8  │ Agents\Config: CRUD só local     │ Settings/Agents/index.jsx         │ Alterações não persistem             │ Integrar com API                 │
└─────┴──────────────────────────────────┴───────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────┘

MÉDIO

┌─────┬───────────────────────────────┬───────────────────────────────────────────────┬───────────────────────────────┬─────────────────────────────────────────────────┐
│  #  │           Problema            │                  Arquivo(s)                   │            Impacto            │                    Correção                     │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M1  │ console.log em produção       │ Telemetry (2x), History (1x), Login (1x),     │ Vazamento de dados            │ Remover                                         │
│     │                               │ Agents (1x), IED (1x)                         │                               │                                                 │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M2  │ Bibliotecas não utilizadas    │ package.json                                  │ Bundle maior                  │ Remover: jquery, moment, chart.js, apexcharts,  │
│     │                               │                                               │                               │ MUI, react-datepicker, etc.                     │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M3  │ Dois sistemas de toast        │ package.json                                  │ Inconsistência                │ Padronizar em react-hot-toast                   │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M4  │ Axios + Fetch misturados      │ Diversos                                      │ Inconsistência                │ Padronizar em fetch                             │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M5  │ Status badge hardcoded        │ Telemetry/columns.jsx:148                     │ Não reflete status real       │ Usar campo status                               │
│     │ "Online"                      │                                               │                               │                                                 │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M6  │ Copyright 2024                │ LayoutAdmin.jsx:76                            │ Ano desatualizado             │ Atualizar                                       │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M7  │ Botão voltar IED Show vai     │ IED/Show/index.jsx:49                         │ Rota incorreta                │ Alterar para /ieds                              │
│     │ para settings                 │                                               │                               │                                                 │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M8  │ Botão Editar IED Show sem     │ IED/Show/index.jsx:67                         │ Infuncional                   │ Adicionar handler ou remover                    │
│     │ ação                          │                                               │                               │                                                 │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M9  │ Após salvar IED:              │ IED/index.jsx:102                             │ Modal reabre                  │ Alterar para false                              │
│     │ setShowModal(true)            │                                               │                               │                                                 │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M10 │ Textos ".." nos cards Home    │ Home/index.jsx:279,335                        │ Visualmente confuso           │ Remover                                         │
├─────┼───────────────────────────────┼───────────────────────────────────────────────┼───────────────────────────────┼─────────────────────────────────────────────────┤
│ M11 │ GreetingBanner usa Tailwind   │ GreetingBanner.jsx                            │ Inconsistência visual (resto  │ Remover ou reescrever                           │
│     │                               │                                               │ usa Bootstrap)                │                                                 │
└─────┴───────────────────────────────┴───────────────────────────────────────────────┴───────────────────────────────┴─────────────────────────────────────────────────┘

BAIXO

┌─────┬────────────────────────────────────────┬─────────────────────────────────────────────┬───────────────────────────────────────────┬─────────────────────────────┐
│  #  │                Problema                │                 Arquivo(s)                  │                  Impacto                  │          Correção           │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B1  │ ~30 componentes legados não removidos  │ Components/ksi/, Components/wizard/, etc    │ Confusão, manutenção                      │ Remover após confirmar não  │
│     │                                        │                                             │                                           │ uso                         │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B2  │ Filtro Home não usado                  │ Pages/Home/forms/filtro.jsx                 │ Código morto                              │ Remover                     │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B3  │ greetingHandler.js duplicado           │ utils/greetingHandler.js +                  │ Redundância                               │ Consolidar                  │
│     │                                        │ GreetingBanner.jsx                          │                                           │                             │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B4  │ Tailwind quase não usado               │ app.css                                     │ CSS desnecessário                         │ Avaliar remoção ou uso      │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B5  │ GuestLayout com nome errado            │ GuestLAyout.jsx                             │ Typo no nome                              │ Renomear                    │
├─────┼────────────────────────────────────────┼─────────────────────────────────────────────┼───────────────────────────────────────────┼─────────────────────────────┤
│ B6  │ Status "active" sem tratar no IED      │ IED/columns.jsx                             │ Status ≠ online/offline mostra            │ Adicionar "active"          │
│     │ columns                                │                                             │ "Desconhecido"                            │                             │
└─────┴────────────────────────────────────────┴─────────────────────────────────────────────┴───────────────────────────────────────────┴─────────────────────────────┘

INFO

┌─────┬─────────────────────────────────────────────────────────────────┐
│  #  │                           Observação                            │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I1  │ Backend PHP customizado com Router próprio (não Laravel routes) │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I2  │ BaseController usa Blade + Inertia (padrão híbrido)             │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I3  │ Sessão hardcoded com user id=1 em todos os serviços PHP         │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I4  │ Template base: Sneat Admin Template (public/assets/)            │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I5  │ Rota /agents no sidebar não possui rota PHP correspondente      │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I6  │ Rota /comtrade não existe no sidebar nem no backend             │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I7  │ react-router-dom v7.15.1 instalado mas não utilizado            │
├─────┼─────────────────────────────────────────────────────────────────┤
│ I8  │ react-scripts v5.0.1 desnecessário (usa Vite)                   │
└─────┴─────────────────────────────────────────────────────────────────┘

---

F. DEPENDÊNCIAS DO BACKEND

F.1 Frontend Pode Corrigir Sozinho

┌─────┬─────────────────────────────────────────────────┐
│  #  │                    Correção                     │
├─────┼─────────────────────────────────────────────────┤
│ 1   │ Renomear ErrorBoundary .jsx → ErrorBoundary.jsx │
├─────┼─────────────────────────────────────────────────┤
│ 2   │ Atualizar import em app.jsx                     │
├─────┼─────────────────────────────────────────────────┤
│ 3   │ Remover BrowserRouter do app.jsx                │
├─────┼─────────────────────────────────────────────────┤
│ 4   │ Remover rota duplicada em api/Rotas.php         │
├─────┼─────────────────────────────────────────────────┤
│ 5   │ Alterar título "OrigemRP" para "AMTK"           │
├─────┼─────────────────────────────────────────────────┤
│ 6   │ Remover console.logs                            │
├─────┼─────────────────────────────────────────────────┤
│ 7   │ Corrigir botão voltar no IED Show               │
├─────┼─────────────────────────────────────────────────┤
│ 8   │ Corrigir setShowModal(true) → false após salvar │
├─────┼─────────────────────────────────────────────────┤
│ 9   │ Remover textos ".." dos cards                   │
├─────┼─────────────────────────────────────────────────┤
│ 10  │ Atualizar copyright                             │
├─────┼─────────────────────────────────────────────────┤
│ 11  │ Corrigir status badge hardcoded                 │
├─────┼─────────────────────────────────────────────────┤
│ 12  │ Adicionar status "active" nas colunas IED       │
├─────┼─────────────────────────────────────────────────┤
│ 13  │ Carregar agents da API para IEDForm             │
└─────┴─────────────────────────────────────────────────┘

F.2 Depende da API/Backend

┌─────┬──────────────────────────┬────────────────────────────────┐
│  #  │       Necessidade        │      Endpoint Necessário       │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 1   │ Tela de Eventos          │ GET /api/v1/events             │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 2   │ Tela de Agents (Config)  │ GET /api/v1/agents             │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 3   │ CRUD Agents              │ POST/PUT/DELETE /api/v1/agents │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 4   │ Configurações do Sistema │ GET/PUT /api/v1/settings       │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 5   │ COMTRADE (nova)          │ GET /api/v1/comtrade           │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 6   │ Detalhe COMTRADE         │ GET /api/v1/comtrade/{id}      │
├─────┼──────────────────────────┼────────────────────────────────┤
│ 7   │ Oscilografia real        │ GET /api/v1/oscillography      │
└─────┴──────────────────────────┴────────────────────────────────┘

---

G. PLANO DE CORREÇÃO

FASE 1 — Correções Estruturais (sem dependência de API)

1.1 Renomear ErrorBoundary .jsx → ErrorBoundary.jsx
1.2 Atualizar import em app.jsx
1.3 Remover BrowserRouter de app.jsx
1.4 Remover rota duplicada em api/Rotas.php
1.5 Alterar título "OrigemRP" para "AMTK" no LayoutAdmin
1.6 Atualizar copyright
1.7 Remover todos os console.logs
1.8 Corrigir botão voltar no IED Show (/settings/ieds → /ieds)
1.9 Corrigir setShowModal após salvar IED
1.10 Remover textos ".." dos cards do Dashboard
1.11 Corrigir status badge hardcoded no Telemetry columns
1.12 Adicionar "active" como status válido no IED columns

FASE 2 — Padronização de Código

2.1 Remover react-router-dom do app.jsx
2.2 Avaliar e remover bibliotecas não utilizadas do package.json
2.3 Consolidar sistema de toast (padronizar react-hot-toast)
2.4 Consolidar HTTP client (padronizar fetch)
2.5 Carregar agents da API para IEDForm
2.6 Limpar componentes legados não utilizados

FASE 3 — Integração API das Telas Mockadas

3.1 Criar endpoints PHP para Events (listagem)
3.2 Integrar tela de Events com API
3.3 Integrar Config IEDs com API (CRUD real)
3.4 Integrar Config Agents com API (CRUD real)
3.5 Integrar Config Sistema com API

FASE 4 — COMTRADE

4.1 Criar rotas PHP para COMTRADE
4.2 Criar serviço PHP Comtrade.php
4.3 Criar página React Comtrade/index.jsx
4.4 Criar página React Comtrade/Show/index.jsx
4.5 Adicionar item no sidebar
4.6 Estruturar para receber dados da API

FASE 5 — Oscilografia

5.1 Integrar Oscillography com API quando disponível
5.2 Estruturar para visualização futura de sinais

FASE 6 — UX/Performance

6.1 Adicionar loading states faltantes

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

FASE 7 — Limpeza Final

7.1 Remover componentes legados confirmados
7.2 Atualizar dependências do package.json
7.3 Verificar build
7.4 Testes visuais

---

Fim do Relatório de Auditoria.

Aguardando autorização para iniciar a FASE 1 — Correções Estruturais.

✻ Churned for 2m 24s · done 11:27 PM

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  ⏸ manual