# API de Filmes - DevOps na Prática

Projeto acadêmico da Fase 1 da disciplina DevOps na Prática.

Autor: Leonardo Almeida Ballesteros.

## Descrição e objetivo

API REST para cadastrar, consultar, atualizar e excluir filmes, desenvolvida com Node.js e Express.

O objetivo é aplicar versionamento com Git, testes automatizados, integração contínua com GitHub Actions, empacotamento com Docker e infraestrutura como código com Terraform.

Os dados ficam em memória e retornam ao estado inicial quando a aplicação é reiniciada.

## Requisitos

### Funcionais

- Listar filmes.
- Consultar um filme pelo ID.
- Cadastrar filmes com título, diretor e ano.
- Atualizar os dados de um filme.
- Excluir filmes.
- Validar os campos obrigatórios e os identificadores.
- Retornar mensagens para dados inválidos e filmes não encontrados.

### Não funcionais

- Comunicação HTTP com dados em JSON.
- Código versionado no GitHub.
- Testes automatizados executados localmente e no CI.
- Aplicação empacotada em uma imagem Docker.
- Contêiner local gerenciado por Terraform.

## Tecnologias

- Node.js 24 e Express 5.
- Node Test Runner e Supertest.
- Git e GitHub.
- GitHub Actions.
- Docker.
- Terraform com o provider kreuzwerker/docker.

## Organização dos arquivos

| Caminho | Finalidade |
| --- | --- |
| src/app.js | Aplicação, validações e rotas |
| test/app.test.js | Testes automatizados |
| .github/workflows/ci.yml | Pipeline de integração contínua |
| Dockerfile | Construção da imagem da aplicação |
| .dockerignore | Exclusões do contexto de construção |
| infra/main.tf | Configuração da infraestrutura local |
| infra/.terraform.lock.hcl | Versões e hashes dos providers |
| package.json | Dependências e comandos do projeto |
| package-lock.json | Versões das dependências instaladas |
| .gitignore | Exclusões do versionamento |

## Executar localmente

Pré-requisitos: Node.js 24 e npm.

Na raiz do projeto:

```bash
npm ci
npm start
```

Acesse: http://localhost:3000/filmes

No PowerShell, caso o wrapper npm.ps1 seja bloqueado, utilize npm.cmd no lugar de npm.

## Executar os testes

```bash
npm test
```

A suíte possui seis testes:

1. Listagem dos filmes.
2. Consulta do filme inicial.
3. Cadastro de um filme.
4. Rejeição de título vazio.
5. Atualização de um filme.
6. Exclusão de um filme.

## Endpoints

| Método | Rota | Operação |
| --- | --- | --- |
| GET | /filmes | Listar filmes |
| GET | /filmes/:id | Consultar filme |
| POST | /filmes | Cadastrar filme |
| PUT | /filmes/:id | Atualizar filme |
| DELETE | /filmes/:id | Excluir filme |

Exemplo de corpo JSON para cadastro ou atualização:

```json
{
  "titulo": "A Origem",
  "diretor": "Christopher Nolan",
  "ano": 2010
}
```

## Integração contínua

O workflow está em .github/workflows/ci.yml.

A execução ocorre em pushes para main, pull requests direcionados a main e acionamentos manuais.

Etapas:

1. Baixar o código do repositório.
2. Configurar o Node.js 24.
3. Instalar as dependências com npm ci.
4. Executar os testes com npm test.

Uma falha nos testes faz a execução do pipeline falhar.

O pipeline atual verifica a aplicação. A construção Docker e a aplicação do Terraform são executadas localmente.

## Infraestrutura como código

A infraestrutura utiliza Docker Desktop com contêineres Linux e Terraform no Windows.

O Terraform conecta-se ao Docker pelo endpoint:

```text
npipe:////./pipe/dockerDesktopLinuxEngine
```

Essa configuração é específica do ambiente Windows utilizado. Outros ambientes precisam ajustar o endpoint do provider.

O recurso definido cria o contêiner api-filmes usando a imagem local api-filmes:1.0.

A porta 3001 do computador é vinculada à porta 3000 do contêiner, com acesso restrito ao endereço local 127.0.0.1.

### Preparar a imagem

Com o Docker Desktop em execução, execute na raiz:

```bash
docker build -t api-filmes:1.0 .
```

A imagem precisa existir antes de aplicar o Terraform.

### Criar o contêiner

Execute na raiz do projeto, um comando por vez:

```bash
terraform -chdir=infra init
terraform -chdir=infra validate
terraform -chdir=infra plan
terraform -chdir=infra apply
```

Confira o plano e digite yes quando solicitado.

Acesse: http://localhost:3001/filmes

### Remover a infraestrutura local

Para excluir o contêiner criado pelo Terraform:

```bash
terraform -chdir=infra destroy
```

Confira o plano de remoção e digite yes para confirmar. Os dados em memória da aplicação serão perdidos.

### Arquivos do Terraform

O arquivo infra/.terraform.lock.hcl é versionado.

A pasta .terraform/ e os arquivos de estado e de plano são ignorados pelo Git. O estado permanece no computador e deve ser preservado para gerenciar o recurso criado.

## Validações realizadas

- Seis testes automatizados aprovados localmente.
- Pipeline de CI concluído com sucesso no GitHub Actions.
- Imagem Docker construída com sucesso.
- Configuração Terraform inicializada e validada.
- Contêiner criado com terraform apply.
- Endpoint /filmes acessado pela porta 3001, retornando o filme inicial.

## Limitações

- Armazenamento apenas em memória.
- Sem autenticação ou interface gráfica.
- Infraestrutura executada localmente, sem implantação em nuvem.
- Sem implantação automática pelo pipeline.

## Links

- Repositório: https://github.com/leoballesteros/devops-fase1
- Execuções do CI: https://github.com/leoballesteros/devops-fase1/actions
- Workflow: https://github.com/leoballesteros/devops-fase1/blob/main/.github/workflows/ci.yml
- Infraestrutura: https://github.com/leoballesteros/devops-fase1/blob/main/infra/main.tf