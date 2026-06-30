# Documentação do Projeto

## Visão Geral
Aplicativo móvel desenvolvido com Expo + React Native. Usa `expo-router` para navegação, `axios` para consumo de APIs e `AsyncStorage` para persistência de sessão.

## Arquitetura (Resumo)
* Navegação baseada em arquivos pelo `expo-router`.
* Componentes reutilizáveis em `src/components/`.
* Autenticação gerenciada por contexto em `src/context/AuthContext.js` (estado `user`, `loading`, `signIn`, `signOut`, restauração de sessão via `useEffect`).
* Consumo de API via `axios` com interceptors para tratar 401/403.

### Fluxo de autenticação
1. `app/index.js` aguarda a recuperação do estado de autenticação.
2. Se autenticado, redireciona para `/(tabs)/home`; caso contrário, para `/login`.
3. O token é salvo em `AsyncStorage` e aplicado como header `Authorization` nas requisições.
4. Em respostas 401/403 o interceptor redireciona para `/login`.

## Serviços de API
Em `src/services/api.js` existem dois clientes Axios:
- `api` — backend principal (`http://10.0.2.2:8080`).
- `apiCorreios` — integração com ViaCEP (`https://viacep.com.br/ws/`).

O interceptor de resposta monitora erros de autorização e mantém o fluxo de sessão consistente.

## Estrutura de Navegação
Principais rotas (baseadas em arquivos):
- `app/index.js` — carregamento e redirecionamento inicial
- `app/login.js` — autenticação
- `app/cadastrar-administrador.js` — cadastro
- `app/(tabs)/_layout.js` — layout de abas após autenticação

Abas principais:
- `home` — tela principal com resumo de imóveis
- `cadastrar-imovel` — cadastro de imóvel
- `perfil` — perfil do usuário autenticado

Rotas aninhadas (não visíveis na barra de abas):
- `app/(tabs)/imovel/[id].js` — detalhes de imóvel
- `app/(tabs)/imovel/editar-imovel.js`
- `app/(tabs)/imovel/financeiro.js`
- `app/(tabs)/imovel/fluxo-hospedes.js`
- `app/(tabs)/locacao/cadastrar-locacao.js`
- `app/(tabs)/locacao/editar-locacao.js`
- `app/(tabs)/locacao/detalhes-locacao.js`
- `app/(tabs)/locacao/historico-locacao.js`
- `app/(tabs)/proprietario/cadastrar-proprietario.js`
- `app/(tabs)/proprietario/editar-proprietario.js`
- `app/(tabs)/inquilino/cadastrar-inquilino.js`
- `app/(tabs)/inquilino/editar-inquilino.js`

Configuração de backend local:
- No emulador Android use `http://10.0.2.2:8080`.
- Em dispositivo físico ou servidor remoto, atualize `src/services/api.js`.

Observações:
- Mantenha o backend (Spring Boot) rodando ao testar o aplicativo.
- O `AsyncStorage` restaura a sessão automaticamente.
- Em caso de erro 401, limpe a cache do app ou reinstale o Expo Go.

## Estrutura de Pastas
- `app/` — páginas e rotas do Expo Router
- `app/(tabs)/` — layout de abas e telas protegidas
- `src/` — lógica compartilhada e recursos (components, context, services, theme)
- `assets/` — imagens e arquivos estáticos

## Links úteis
- Rotas detalhadas: veja `docs/rotas.md` para descrição completa das rotas.
- Conexões com o backend: veja `docs/conexoes-backend.md` para o mapeamento das telas, endpoints e requisições.
- Setup e execução: veja `docs/setup.md` para instruções rápidas de instalação.

## Notas
- `10.0.2.2` conecta o emulador Android ao backend local no Windows.
- Interceptors em `src/services/api.js` redirecionam para `/login` em 401/403.
