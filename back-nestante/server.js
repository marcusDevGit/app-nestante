const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");
const authMiddleware = require("./src/middlewares/authMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use("/usuarios", userRoutes);

//rota protegida (area depois do login)
app.get("/protegida", authMiddleware, (req, res) => {
    res.json({ message: "Você acessou uma Rota protegida", user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
