const express = require("express");

const app = express();
const porta = 3000;

// Permite receber dados em JSON nas requisições.
app.use(express.json());

// Os filmes ficam armazenados na memória.
const filmes = [
    {
        id: 1,
        titulo: "Interestelar",
        diretor: "Christopher Nolan",
        ano: 2014
    }
];

// Lista todos os filmes.
app.get("/filmes", function (req, res) {
    res.json(filmes);
});

// Define o ID do próximo filme.
let proximoId = 2;

// Cadastra um novo filme.
app.post("/filmes", function (req, res) {
    const { titulo, diretor, ano } = req.body || {};

    if (typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            mensagem: "Informe o título do filme."
        });
    }

    if (typeof diretor !== "string" || diretor.trim() === "") {
        return res.status(400).json({
            mensagem: "Informe o diretor do filme."
        });
    }

    if (!Number.isInteger(ano) || ano <= 0) {
        return res.status(400).json({
            mensagem: "Informe o ano como um número inteiro positivo."
        });
    }

    const novoFilme = {
        id: proximoId,
        titulo: titulo.trim(),
        diretor: diretor.trim(),
        ano: ano
    };

    filmes.push(novoFilme);
    proximoId = proximoId + 1;

    return res.status(201).json(novoFilme);
});

// Consulta um filme pelo ID.
app.get("/filmes/:id", function (req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "Informe um ID inteiro positivo."
        });
    }

    const filme = filmes.find(function (filmeAtual) {
        return filmeAtual.id === id;
    });

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    return res.json(filme);
});

// Atualiza os dados de um filme.
app.put("/filmes/:id", function (req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "Informe um ID inteiro positivo."
        });
    }

    const filme = filmes.find(function (filmeAtual) {
        return filmeAtual.id === id;
    });

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    const { titulo, diretor, ano } = req.body || {};

    if (typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            mensagem: "Informe o título do filme."
        });
    }

    if (typeof diretor !== "string" || diretor.trim() === "") {
        return res.status(400).json({
            mensagem: "Informe o diretor do filme."
        });
    }

    if (!Number.isInteger(ano) || ano <= 0) {
        return res.status(400).json({
            mensagem: "Informe o ano como um número inteiro positivo."
        });
    }

    filme.titulo = titulo.trim();
    filme.diretor = diretor.trim();
    filme.ano = ano;

    return res.status(200).json(filme);
});

// Exclui um filme pelo ID.
app.delete("/filmes/:id", function (req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "Informe um ID inteiro positivo."
        });
    }

    const indice = filmes.findIndex(function (filmeAtual) {
        return filmeAtual.id === id;
    });

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    filmes.splice(indice, 1);

    return res.status(200).json({
        mensagem: "Filme excluído com sucesso."
    });
});

// Inicia o servidor somente quando este arquivo é executado diretamente.
if (require.main === module) {
    app.listen(porta, function () {
        console.log("API disponível em http://localhost:" + porta);
    });
}

// Permite que os testes utilizem a aplicação.
module.exports = app;