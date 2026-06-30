# Conexões das telas com o backend

Este documento descreve as principais telas do aplicativo móvel e as requisições HTTP realizadas para o backend Spring Boot.

## Configuração geral

- Base URL do backend: http://10.0.2.2:8080
- Cliente HTTP utilizado: Axios
- Autenticação: token JWT enviado no header Authorization via Bearer
- Arquivo central de configuração: [src/services/api.js](../src/services/api.js)

## 1. Autenticação e cadastro

### Tela de login
- Arquivo: [app/login.js](../app/login.js)
- Requisição:
  - POST /auth/login
  - Body: { email, senha }
- Responsabilidade:
  - autentica o administrador
  - salva token e dados do usuário no AsyncStorage
  - injeta o token nas próximas requisições

### Tela de cadastro de administrador
- Arquivo: [app/cadastrar-administrador.js](../app/cadastrar-administrador.js)
- Requisição:
  - POST /administrador
  - Body: { nome, email, dataNascimento, cpf, senha }
- Responsabilidade:
  - cadastra um novo administrador no backend

---

## 2. Home e perfil

### Tela inicial (Home)
- Arquivo: [app/(tabs)/home.js](../app/(tabs)/home.js)
- Requisições:
  - GET /administrador/perfil
  - GET /imovel ou /imovel?administradorId={id}
- Responsabilidade:
  - busca o perfil do usuário autenticado
  - lista os imóveis vinculados ao administrador logado
  - calcula os totais de imóveis disponíveis e alugados

### Tela de perfil
- Arquivo: [app/(tabs)/perfil.js](../app/(tabs)/perfil.js)
- Requisições:
  - DELETE /administrador/perfil
  - PUT /administrador
- Responsabilidade:
  - excluir conta do administrador autenticado
  - atualizar nome, data de nascimento e demais dados do perfil

---

## 3. Cadastro e edição de imóveis

### Tela de cadastro de imóvel
- Arquivo: [app/(tabs)/cadastrar-imovel.js](../app/(tabs)/cadastrar-imovel.js)
- Requisições:
  - GET via CEP externo: https://viacep.com.br/ws/{cep}/json
  - POST /imovel (multipart/form-data)
- Payload enviado para /imovel:
  - nome
  - rua
  - cep
  - numero
  - complemento
  - bairro
  - cidade
  - estado
  - tipoLocacao
  - status
  - administrador
  - foto (quando houver)
- Responsabilidade:
  - cadastra um imóvel e, em seguida, pode abrir a tela de cadastro de proprietário para vínculo

### Tela de detalhes do imóvel
- Arquivo: [app/(tabs)/imovel/[id].js](../app/(tabs)/imovel/[id].js)
- Requisições:
  - GET /imovel/{id}
  - GET /locacao/imovel/{id}
- Responsabilidade:
  - carrega os dados do imóvel
  - busca a locação ativa vinculada ao imóvel, se houver

### Tela de edição de imóvel
- Arquivo: [app/(tabs)/imovel/editar-imovel.js](../app/(tabs)/imovel/editar-imovel.js)
- Requisições:
  - GET /imovel/{id}
  - POST /imovel/atualizar/{id} (multipart/form-data)
- Responsabilidade:
  - carrega os dados atuais do imóvel
  - envia alterações de dados e foto para o backend

---

## 4. Locações

### Tela de cadastro de locação
- Arquivo: [app/(tabs)/locacao/cadastrar-locacao.js](../app/(tabs)/locacao/cadastrar-locacao.js)
- Requisições:
  - POST /locacao
- Body enviado:
  - status
  - dataInicio
  - dataTermino
  - aluguel
  - observacao
  - imovel
- Responsabilidade:
  - cria uma locação vinculada a um imóvel
  - pode encaminhar para o cadastro de inquilino após a criação

### Tela de detalhes da locação
- Arquivo: [app/(tabs)/locacao/detalhes-locacao.js](../app/(tabs)/locacao/detalhes-locacao.js)
- Requisições:
  - GET /locacao/{id}
- Responsabilidade:
  - exibe os dados completos do contrato e do inquilino vinculado

### Tela de edição de locação
- Arquivo: [app/(tabs)/locacao/editar-locacao.js](../app/(tabs)/locacao/editar-locacao.js)
- Requisições:
  - GET /locacao/{id}
  - PUT /locacao
- Responsabilidade:
  - busca os dados da locação para edição
  - envia alterações do contrato para o backend

### Tela de histórico de locações
- Arquivo: [app/(tabs)/locacao/historico-locacao.js](../app/(tabs)/locacao/historico-locacao.js)
- Requisições:
  - GET /locacao
  - GET /locacao/historico/{imovelId}
- Responsabilidade:
  - lista o histórico de contratos, podendo filtrar por imóvel

### Cancelamento de contrato
- Arquivo: [src/components/DadosLocacaoItem/index.js](../src/components/DadosLocacaoItem/index.js)
- Requisição:
  - PUT /locacao/{id}/cancelar
- Responsabilidade:
  - encerra a locação ativa e libera o imóvel para novo cadastro

---

## 5. Inquilinos e proprietários

### Tela de cadastro de inquilino
- Arquivo: [app/(tabs)/inquilino/cadastrar-inquilino.js](../app/(tabs)/inquilino/cadastrar-inquilino.js)
- Requisições:
  - POST /pessoa
  - PUT /locacao
- Fluxo:
  1. cria a pessoa/inquilino no backend
  2. vincula essa pessoa à locação através do ID da locação

### Tela de edição de inquilino
- Arquivo: [app/(tabs)/inquilino/editar-inquilino.js](../app/(tabs)/inquilino/editar-inquilino.js)
- Requisições:
  - GET /pessoa/{id}
  - PUT /pessoa
- Responsabilidade:
  - busca os dados do inquilino para edição
  - envia os dados atualizados de volta ao backend

### Tela de cadastro de proprietário
- Arquivo: [app/(tabs)/proprietario/cadastrar-proprietario.js](../app/(tabs)/proprietario/cadastrar-proprietario.js)
- Requisições:
  - POST /proprietario
  - GET /imovel/{id}
  - POST /imovel/vincular-proprietario
- Responsabilidade:
  - cadastra um proprietário
  - vincula o proprietário ao imóvel, quando informado via parâmetro na rota

### Tela de edição de proprietário
- Arquivo: [app/(tabs)/proprietario/editar-proprietario.js](../app/(tabs)/proprietario/editar-proprietario.js)
- Requisições:
  - GET /proprietario/{id}
  - PUT /proprietario/{id}
- Responsabilidade:
  - carrega os dados do proprietário e atualiza as informações no backend

---

## 6. Observações importantes

- O token JWT é armazenado via AsyncStorage e reaproveitado nas requisições subsequentes.
- Em caso de erro 401/403, o interceptor de resposta redireciona o usuário para a tela de login.
- Alguns cadastros usam multipart/form-data para envio de imagem.
- O app também faz requisições externas para consulta de CEP via ViaCEP.
