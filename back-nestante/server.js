const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");
const authMiddleware = require("./src/middlewares/authMiddleware");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/usuarios", userRoutes);

//rota protegida (area depois do login)
app.get("/protegida", authMiddleware, (req, res) => {
    res.json({ message: "Você acessou uma Rota protegida", user: req.user });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
