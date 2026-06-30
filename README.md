# Central de Imóveis - Aplicativo Móvel (Frontend)

## Documentação
Para a documentação consolidada do projeto, veja [docs/index.md](docs/index.md).
Para o mapeamento das telas com os endpoints e requisições do backend, consulte [docs/conexoes-backend.md](docs/conexoes-backend.md).

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

- Node.js
- Android Studio
- SQL Server
- Expo CLI

  ```bash
  npm install -g expo-cli
  ```

- Um dispositivo virtual Android (AVD) ou o aplicativo Expo Go.

### Configuração

Antes de executar o projeto, realize as seguintes configurações:

1. Crie um banco de dados chamado **`central_imoveis`** no SQL Server.
   - As tabelas serão criadas automaticamente pelo backend na primeira execução.

2. Configure a conexão com o banco de dados.
   - No backend, atualize a URL, a porta e as credenciais do SQL Server no arquivo **`application-dev.properties`**.

3. Configure o diretório para upload das imagens dos imóveis.
   - Crie uma pasta em seu computador para armazenar as imagens.
   - Atualize o caminho dessa pasta nos seguintes arquivos:
     - **`CorsConfig.java`** (linha 29);
     - **`ImovelController.java`**, no método **`cadastrar()`** (linha 57);
     - **`ImovelController.java`**, no método **`atualizar()`** (linha 145).

4. Para cadastrar imóveis com fotos utilizando o emulador Android, é necessário que existam imagens salvas na galeria do emulador.

### Como rodar o projeto

1. Clone os repositórios [central-imoveis-api](https://github.com/lara-peddinghausen/central-imoveis-api) e [central-imoveis-mobile](https://github.com/lara-peddinghausen/central-imoveis-mobile).

2. Abra ambos os projetos na IDE de sua preferência.

3. No diretório do projeto **`central-imoveis-mobile`**, abra um terminal e instale as dependências:

   ```bash
   npm install
   ```

4. No projeto **`central-imoveis-api`**, execute a classe **`ApiApplication.java`**.

   > **Importante:** mantenha o backend (Spring Boot) em execução durante os testes do aplicativo.

5. Abra o **Android Studio** e inicie um dispositivo virtual (Android Virtual Device – AVD).

6. No terminal do diretório **`central-imoveis-mobile`**, execute:

   ```bash
   npx expo start
   ```

7. Com o Expo iniciado, pressione a tecla **`a`** no terminal (ou clique em **Run on Android device/emulator**) para abrir o aplicativo no emulador Android.
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
