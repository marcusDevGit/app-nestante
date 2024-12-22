const { createUser, loginUser, requestPasswordReset, resetPassword } = require('../controllers/userController');
const prisma = require('../config/database');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Adicione esta linha
const { sendEmail } = require('../utils/email');

jest.mock('../config/database', () => {
    return {
        usuario: {
            findUnique: jest.fn(),
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    };
});
jest.mock('bcryptjs');
jest.mock('jsonwebtoken'); // Adicione esta linha
jest.mock('../utils/email');

describe('User Controller Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createUser deve criar um novo usuário', async () => {
        const req = { body: { nome: 'Test User', email: 'test@example.com', senha: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        prisma.usuario.findUnique.mockResolvedValue(null);
        prisma.usuario.create.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com' });
        bcryptjs.hash.mockResolvedValue('hashedpassword');

        await createUser(req, res);

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.usuario.create).toHaveBeenCalledWith({
            data: {
                nome: 'Test User',
                email: 'test@example.com',
                senha: 'hashedpassword',
            },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Usuário criado com sucesso!' }));
    });

    test('loginUser deve fazer login de um usuário', async () => {
        const req = { body: { email: 'test@example.com', senha: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com', senha: 'hashedpassword' });
        bcryptjs.compare.mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('token');

        await loginUser(req, res);

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 1, email: 'test@example.com' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Login realizado com sucesso!' }));
    });

    test('requestPasswordReset deve solicitar recuperação de senha', async () => {
        const req = { body: { email: 'test@example.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com' });
        bcryptjs.hash.mockResolvedValue('resettoken');
        sendEmail.mockResolvedValue(true);

        await requestPasswordReset(req, res);

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcryptjs.hash).toHaveBeenCalledWith(expect.any(String), 10);
        expect(prisma.usuario.update).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
            data: { resetToken: 'resettoken', resetExpires: expect.any(Date) },
        });
        expect(sendEmail).toHaveBeenCalledWith(
            'test@example.com',
            'Recuperação de Senha',
            expect.stringContaining('http://localhost:5173/reset-password?token=resettoken')
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'E-mail de recuperação enviado com sucesso!' }));
    });

    test('resetPassword deve redefinir a senha', async () => {
        const req = { body: { token: 'validtoken', novaSenha: 'newpassword123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        prisma.usuario.findFirst.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com', resetToken: 'validtoken', resetExpires: new Date(Date.now() + 3600000) });
        bcryptjs.hashSync.mockReturnValue('hashednewpassword');

        await resetPassword(req, res);

        expect(prisma.usuario.findFirst).toHaveBeenCalledWith({
            where: {
                resetToken: { not: null },
                resetExpires: { gt: expect.any(Date) },
            },
        });
        expect(bcryptjs.hashSync).toHaveBeenCalledWith('newpassword123', 10);
        expect(prisma.usuario.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { senha: 'hashednewpassword', resetToken: null, resetExpires: null },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Senha redefinida com sucesso!' }));
    });
});