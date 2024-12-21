const express = require("express");
const { createUser, getUsers, loginUser, resetPassword, requestPasswordReset } = require("../controllers/userController");

const router = express.Router();

router.post("/register", createUser); // Rota para criar usuário
router.post("/login", loginUser); // Rota para login de usuário
router.get("/", getUsers); // Rota para listar usuários (testes)

//recuperação de senha
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


module.exports = router;
