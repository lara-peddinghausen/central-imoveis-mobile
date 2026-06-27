# Documentação do Projeto

## Central de Imóveis - Aplicativo Móvel

Este diretório contém a documentação do frontend mobile do aplicativo de administração de imóveis.

## Visão Geral
O app é desenvolvido com **Expo + React Native** e utiliza **Expo Router** para navegação, **Axios** para consumo de APIs e **AsyncStorage** para manter a sessão do usuário.

## Estrutura de Navegação
### Rotas principais
* `app/index.js` — tela de carregamento e redirecionamento inicial
* `app/login.js` — tela de autenticação
* `app/cadastrar-administrador.js` — cadastro de administrador
* `app/(tabs)/_layout.js` — layout de abas após autenticação

### Abas principais
* `home` — tela principal com resumo de imóveis
* `cadastrar-imovel` — cadastro de imóvel
* `perfil` — perfil do usuário autenticado

### Rotas aninhadas ocultas
* `imovel/[id]`
* `imovel/editar-imovel`
* `imovel/financeiro`
* `imovel/fluxo-hospedes`
* `locacao/cadastrar-locacao`
* `locacao/editar-locacao`
* `locacao/detalhes-locacao`
* `locacao/historico-locacao`
* `proprietario/cadastrar-proprietario`
* `proprietario/editar-proprietario`
* `inquilino/cadastrar-inquilino`
* `inquilino/editar-inquilino`

## Autenticação
A autenticação é gerenciada em `src/context/AuthContext.js`.
* Armazena token e dados do usuário em `AsyncStorage`
* Restaura sessão na inicialização
* Define o cabeçalho `Authorization` no Axios
* Redireciona para `/login` em respostas 401 ou 403

## Configuração de API
A API principal está configurada em `src/services/api.js`:
* `baseURL: http://10.0.2.2:8080`

Também existe a integração com a API ViaCEP:
* `https://viacep.com.br/ws/`

## Execução do Projeto
```bash
npm install
npm start
npm run android
npm run ios
npm run web
```

## Estrutura de Pastas
* `app/` — páginas e rotas do Expo Router
* `app/(tabs)/` — layout de abas e navegação
* `src/` — lógica de negócio, contexto, serviços e componentes
* `assets/` — recursos estáticos

## Notas
* `10.0.2.2` é usado para conectar o emulador Android ao backend local no Windows.
* A autenticação depende de um backend Spring Boot com JWT.
