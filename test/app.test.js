const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

// Confere a listagem e os dados do filme inicial.
test("GET /filmes deve listar os filmes", async function () {
    const resposta = await request(app).get("/filmes");

    assert.equal(resposta.status, 200);
    assert.ok(Array.isArray(resposta.body));

    const filme = resposta.body.find(function (filmeAtual) {
        return filmeAtual.id === 1;
    });

    assert.deepEqual(filme, {
        id: 1,
        titulo: "Interestelar",
        diretor: "Christopher Nolan",
        ano: 2014
    });
});

// Confere a consulta individual.
test("GET /filmes/1 deve retornar o filme inicial", async function () {
    const resposta = await request(app).get("/filmes/1");

    assert.equal(resposta.status, 200);

    assert.deepEqual(resposta.body, {
        id: 1,
        titulo: "Interestelar",
        diretor: "Christopher Nolan",
        ano: 2014
    });
});

// Confere o cadastro e o armazenamento do filme.
test("POST /filmes deve cadastrar um filme", async function () {
    const dados = {
        titulo: "A Origem",
        diretor: "Christopher Nolan",
        ano: 2010
    };

    const cadastro = await request(app)
        .post("/filmes")
        .send(dados);

    assert.equal(cadastro.status, 201);
    assert.ok(Number.isInteger(cadastro.body.id));
    assert.ok(cadastro.body.id > 1);

    const filmeEsperado = {
        id: cadastro.body.id,
        titulo: dados.titulo,
        diretor: dados.diretor,
        ano: dados.ano
    };

    assert.deepEqual(cadastro.body, filmeEsperado);

    const consulta = await request(app)
        .get("/filmes/" + cadastro.body.id);

    assert.equal(consulta.status, 200);
    assert.deepEqual(consulta.body, filmeEsperado);
});

// Confere que um cadastro inválido não altera a lista.
test("POST /filmes deve rejeitar título vazio", async function () {
    const antes = await request(app).get("/filmes");

    assert.equal(antes.status, 200);

    const cadastro = await request(app)
        .post("/filmes")
        .send({
            titulo: "   ",
            diretor: "Christopher Nolan",
            ano: 2010
        });

    assert.equal(cadastro.status, 400);
    assert.equal(
        cadastro.body.mensagem,
        "Informe o título do filme."
    );

    const depois = await request(app).get("/filmes");

    assert.equal(depois.status, 200);
    assert.deepEqual(depois.body, antes.body);
});

test("PUT /filmes/:id deve atualizar um filme", async function () {
    // Cria um filme próprio para este teste.
    const cadastro = await request(app)
        .post("/filmes")
        .send({
            titulo: "Filme para atualizar",
            diretor: "Diretor inicial",
            ano: 2000
        });

    assert.equal(cadastro.status, 201);

    const id = cadastro.body.id;

    const dadosAtualizados = {
        titulo: "Matrix",
        diretor: "Lana e Lilly Wachowski",
        ano: 1999
    };

    const atualizacao = await request(app)
        .put("/filmes/" + id)
        .send(dadosAtualizados);

    assert.equal(atualizacao.status, 200);

    const filmeEsperado = {
        id: id,
        ...dadosAtualizados
    };

    assert.deepEqual(atualizacao.body, filmeEsperado);

    // Confirma que a alteração ficou armazenada no array.
    const consulta = await request(app)
        .get("/filmes/" + id);

    assert.equal(consulta.status, 200);
    assert.deepEqual(consulta.body, filmeEsperado);
});

test("DELETE /filmes/:id deve excluir um filme", async function () {
    // Cria um filme próprio para este teste.
    const cadastro = await request(app)
        .post("/filmes")
        .send({
            titulo: "Filme para excluir",
            diretor: "Diretor de teste",
            ano: 2020
        });

    assert.equal(cadastro.status, 201);

    const id = cadastro.body.id;

    const exclusao = await request(app)
        .delete("/filmes/" + id);

    assert.equal(exclusao.status, 200);
    assert.equal(
        exclusao.body.mensagem,
        "Filme excluído com sucesso."
    );

    // Confirma que o filme não pode mais ser consultado.
    const consulta = await request(app)
        .get("/filmes/" + id);

    assert.equal(consulta.status, 404);
    assert.equal(
        consulta.body.mensagem,
        "Filme não encontrado."
    );

    // Tentar excluir novamente também deve retornar 404.
    const segundaExclusao = await request(app)
        .delete("/filmes/" + id);

    assert.equal(segundaExclusao.status, 404);
});