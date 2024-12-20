const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Rota para listar tarefas
app.get("/tarefas", async (req, res) => {
    const tarefas = await prisma.tarefa.findMany();
    res.json(tarefas);
});

// Rota para criar uma nova tarefa
app.post("/tarefas", async (req, res) => {
    const { nome, descricao, status } = req.body;
    const novaTarefa = await prisma.tarefa.create({
        data: { nome, descricao, status },
    });
    res.json(novaTarefa);
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
