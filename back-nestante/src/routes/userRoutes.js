const express = require("express");
const { createUser, getUsers, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", createUser); // Rota para criar usuário
router.post("/login", loginUser); // Rota para login de usuário
router.get("/", getUsers); // Rota para listar usuários (testes)

module.exports = router;
