# Rotas do Projeto

Para o mapeamento técnico das telas com os endpoints e requisições do backend, consulte [conexoes-backend.md](conexoes-backend.md).

## Estrutura de rotas principais
O aplicativo usa **Expo Router** para navegação baseada em arquivos.

### Rotas públicas
* `app/index.js` — tela de carregamento e redirecionamento inicial
* `app/login.js` — tela de login
* `app/cadastrar-administrador.js` — tela de cadastro de administrador

### Rotas protegidas / pós-login
As rotas protegidas são renderizadas dentro de `app/(tabs)/_layout.js`.

#### Abas visíveis
* `app/(tabs)/home.js` — tela principal com lista e resumo de imóveis
* `app/(tabs)/cadastrar-imovel.js` — tela de cadastro de imóvel
* `app/(tabs)/perfil.js` — tela de perfil do usuário

#### Rotas aninhadas ocultas
Estas rotas não aparecem na barra de abas, mas são acessadas pelo fluxo do aplicativo:
* `app/(tabs)/imovel/[id].js` — detalhes de imóvel
* `app/(tabs)/imovel/editar-imovel.js` — edição de imóvel
* `app/(tabs)/imovel/financeiro.js` — informações financeiras do imóvel
* `app/(tabs)/imovel/fluxo-hospedes.js` — fluxo de hóspedes do imóvel
* `app/(tabs)/locacao/cadastrar-locacao.js` — cadastro de locação
* `app/(tabs)/locacao/editar-locacao.js` — edição de locação
* `app/(tabs)/locacao/detalhes-locacao.js` — detalhes de locação
* `app/(tabs)/locacao/historico-locacao.js` — histórico de locações
* `app/(tabs)/proprietario/cadastrar-proprietario.js` — cadastro de proprietário
* `app/(tabs)/proprietario/editar-proprietario.js` — edição de proprietário
* `app/(tabs)/inquilino/cadastrar-inquilino.js` — cadastro de inquilino
* `app/(tabs)/inquilino/editar-inquilino.js` — edição de inquilino

## Navegação programática
* `app/index.js` usa `useRouter` para redirecionar o usuário com base no estado de autenticação.
* `app/cadastrar-administrador.js` usa `router.replace('/login')` após cadastro bem-sucedido.
* `src/services/api.js` usa `router.replace('/login')` quando o backend retorna 401 ou 403.
