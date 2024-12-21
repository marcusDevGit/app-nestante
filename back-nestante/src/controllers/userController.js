const prisma = require("../config/database");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Criação de usuário
const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Verifica se o email já está cadastrado
        const emailExiste = await prisma.usuario.findUnique({ where: { email } });
        if (emailExiste) {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        // Hash da senha
        const senhaHash = await bcryptjs.hash(senha, 10);

        // Criação do usuário
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
            },
        });

        res.status(201).json({ message: "Usuário criado com sucesso!", usuario: novoUsuario });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário.", message: error.message });
    }
};

// Listar usuários (teste)
const getUsers = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};


// Login de usuário
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Verifica a senha
        const senhaCorreta = await bcryptjs.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: "Senha inválida." });
        }

        // Gera um token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar login." });
    }
};

module.exports = { createUser, getUsers, loginUser };

