# Guia de Configuração

## Requisitos
- Node.js
- Expo CLI instalado globalmente
- Emulador Android/iOS ou Expo Go em dispositivo físico

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

1. Crie um banco de dados chamado **`central_imoveis`** no SQL Server:
   ```
   CREATE DATABASE central_imoveis; 
   GO
   ```
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
```

## Configuração de backend local
- No emulador Android, o backend local deve ser acessível em `http://10.0.2.2:8080`.
- Para dispositivo físico ou servidor remoto, atualize `src/services/api.js` com a URL adequada.

## Observações rápidas
- Mantenha o backend (Spring Boot) rodando ao testar o aplicativo.
- Para detalhes sobre autenticação, fluxo da aplicação e interceptors, consulte `docs/index.md`.
- Para o mapeamento das telas com os endpoints e requisições do backend, consulte [conexoes-backend.md](conexoes-backend.md).
