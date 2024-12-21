const prisma = require("../config/database");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");

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



// Solicitação de recuperação de senha
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("iniciado processo de recuperação de senha para", email);
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            console.log("Usuário não encontrado", email);
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Gerar token único e expirável
        const resetToken = await bcryptjs.hash(email + Date.now(), 10);// combina email e timestamp
        const resetExpires = new Date(Date.now() + 3600000); // 1 hora de validade

        // Atualizar o usuário no banco
        await prisma.usuario.update({
            where: { email },
            data: { resetToken, resetExpires },
        });

        // link para redefinir a senha
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
        console.log("Link para redefinir senha:", resetLink);
        //Enviar e-mail de recuperação
        await sendEmail(
            email,
            "Recuperação de Senha",
            `Você solicitou a recuperação de senha. Use o link abaixo para redefinir sua senha. O link expira em 1 hora.\n\n${resetLink}`
        );

        res.status(200).json({ message: "E-mail de recuperação enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao processar recuperação de senha:", error);
        res.status(500).json({ error: "Erro ao processar recuperação de senha." });
    }
};

// Redefinir senha
const resetPassword = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        console.log("Redefinir senha com token", token);
        // Encontrar usuário pelo token
        const usuario = await prisma.usuario.findFirst({
            where: {
                resetToken: { not: null },
                resetExpires: { gt: new Date() }
            },
        });

        if (!usuario) {
            console.log("Token inválido ou expirado", token);
            return res.status(400).json({ error: "Token inválido ou expirado." });
        }

        // Atualizar senha e limpar token
        const senhaHash = await bcryptjs.hashSync(novaSenha, 10);

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { senha: senhaHash, resetToken: null, resetExpires: null },
        });

        res.status(200).json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ error: "Erro ao redefinir senha." });
    }
};


module.exports = {
    createUser, getUsers, loginUser, requestPasswordReset,
    resetPassword,
};

