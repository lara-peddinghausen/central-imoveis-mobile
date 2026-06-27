# Arquitetura do Projeto

## Visão geral
O aplicativo segue uma arquitetura simples de frontend mobile com foco em:
* navegação baseada em arquivos pelo `expo-router`
* separação de componentes reutilizáveis
* gerenciamento de autenticação por contexto
* consumo de API via `axios`

## Estrutura de pastas
* `app/` — páginas e rotas do Expo Router
  * `app/(tabs)/` — layout de abas e telas protegidas
* `src/` — lógica compartilhada e recursos da aplicação
  * `src/components/` — componentes reutilizáveis (botões, inputs, cards, etc.)
  * `src/context/` — contexto de autenticação
  * `src/services/` — configuração e interceptors de API
  * `src/theme/` — cores, tipografia e espaçamento
* `assets/` — imagens e outros arquivos estáticos

## Autenticação
A autenticação é centralizada em `src/context/AuthContext.js`:
* estado `user` e `loading`
* `signIn(email, senha)` para login e armazenamento de token
* `signOut()` para limpar sessão
* `useEffect` para restaurar sessão ao iniciar o app

### Fluxo de autenticação
1. `app/index.js` espera a recuperação do estado de autenticação.
2. Se `signed` for verdadeiro, redireciona para `/(tabs)/home`.
3. Se `signed` for falso, redireciona para `/login`.
4. O token é salvo em `AsyncStorage` e reaplicado no header do Axios.
5. Em caso de 401/403, o interceptor redireciona para `/login`.

## Serviços de API
Em `src/services/api.js` existem dois clientes Axios:
* `api` — backend principal (`http://10.0.2.2:8080`)
* `apiCorreios` — integração com ViaCEP (`https://viacep.com.br/ws/`)

### Interceptor de resposta
O interceptor monitora erros de autorização:
* 401 ou 403 => redireciona para `/login`
* mantém o fluxo de sessão consistente
