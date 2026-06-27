# Guia de Configuração

## Requisitos
* Node.js
* Expo CLI instalado globalmente
* Emulador Android/iOS ou Expo Go em dispositivo físico

## Instalação
No diretório do projeto:
```bash
npm install
```

## Comandos principais
```bash
npm start          # inicia o servidor Expo
npm run android    # abre no emulador Android
npm run ios        # abre no emulador iOS
npm run web        # abre no browser
```

## Configuração de backend local
* O app aponta para `http://10.0.2.2:8080` no Android Emulator.
* Se estiver usando um dispositivo físico ou servidor remoto, atualize `src/services/api.js`.

## Observações
* Mantenha o backend Spring Boot rodando antes de testar fluxos de login e cadastro.
* O `AsyncStorage` é usado para manter a sessão, então o aplicativo tenta restaurar login automaticamente.
* Se enfrentar erro 401, limpe a cache do app ou reinstale o Expo Go.
