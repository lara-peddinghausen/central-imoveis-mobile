# Central de Imóveis - Aplicativo Móvel (Frontend)

## Visão Geral
Este repositório contém o frontend mobile do **Sistema de Administração de Imóveis para Locação**.
O aplicativo é desenvolvido com **Expo + React Native** e usa **Expo Router** para navegação, **Axios** para consumo de APIs e **AsyncStorage** para manter a sessão do usuário.

> ⚠️ Status do Projeto: 🚧 Em desenvolvimento

---

## Tecnologias Utilizadas
* **React Native** (0.81.5)
* **Expo** (~54.0.33)
* **Expo Router** (~6.0.23)
* **Axios** (^1.17.0)
* **AsyncStorage** (@react-native-async-storage/async-storage)
* **React Native Paper** (^5.15.3)
* **TypeScript** como dependência de desenvolvimento
* **Expo Image Picker** para seleção de imagens
* **Expo Linking** para manipulação de URLs

---

## Arquitetura do Projeto
### Rotas principais
O app usa `app/_layout.js` para definir a pilha principal com as telas:
* `index` — tela de carregamento / redirecionamento inicial
* `login` — tela de autenticação
* `cadastrar-administrador` — tela de cadastro de administrador
* `(tabs)` — navegação de abas após autenticação

### Abas principais
Em `app/(tabs)/_layout.js` há três abas visíveis:
* `home` — tela principal com resumo de imóveis
* `cadastrar-imovel` — cadastro de novo imóvel
* `perfil` — perfil do usuário autenticado

### Rotas aninhadas ocultas
A navegação também contém rotas internas utilizadas por telas específicas, sem aparecer diretamente na barra de abas:
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

---

## Fluxo de Autenticação
A autenticação é gerenciada em `src/context/AuthContext.js`.
* Guarda token e dados do usuário no `AsyncStorage`
* Recupera sessão na inicialização do app
* Define o cabeçalho `Authorization` no Axios para todas as requisições
* Redireciona para `/login` quando recebe `401` ou `403`

### Chaves usadas no AsyncStorage
* `@centralImoveis:token`
* `@centralImoveis:user`

---

## Configuração de API
A API principal está definida em `src/services/api.js`:
* `baseURL: http://10.0.2.2:8080`

> Observação: `10.0.2.2` é o host padrão para conectar o emulador Android ao backend local do Windows. Atualize para outro endereço se estiver usando dispositivo físico ou backend remoto.

Também há integração com a API ViaCEP em `apiCorreios`:
* `https://viacep.com.br/ws/`

---

## Instalação e execução
### Pré-requisitos
* Node.js
* Expo CLI (`npm install -g expo-cli`)
* Emulador Android/iOS ou Expo Go no dispositivo físico

### Comandos
```bash
npm install
npm start
npm run android
npm run ios
npm run web
```

---

## Estrutura de pastas
* `app/` — páginas e rotas do Expo Router
* `app/(tabs)/` — layout e telas de abas
* `src/` — lógica de negócio e UI compartilhada
  * `src/components/` — componentes reutilizáveis
  * `src/context/` — contexto de autenticação
  * `src/services/` — configuração de APIs
  * `src/theme/` — cores, tipografia, espaçamento
* `assets/` — imagens e recursos estáticos

---

## Principais funcionalidades
* Autenticação de usuário
* Rotas organizadas com `expo-router`
* Cadastro e edição de imóveis
* Fluxo de locações e histórico contratual
* Gestão de inquilinos e proprietários
* Perfil do administrador
* Comunicação com backend via token JWT

---

## Notas importantes
* O projeto utiliza `expo-router` em um modelo de navegação baseada em arquivos.
* O estado de autenticação é verificado em `app/index.js` e redireciona automaticamente para a aba correta.
* As rotas de edição e detalhes são carregadas como rotas ocultas para manter a barra de abas limpa.

---

## Como contribuir
1. Crie uma branch descritiva
2. Faça commits atômicos e claros
3. Atualize o `README.md` caso adicione novas telas ou rotas
4. Teste no emulador/dispositivo antes de submeter
