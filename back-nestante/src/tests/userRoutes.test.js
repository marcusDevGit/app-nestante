const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
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

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/users/register deve criar um novo usuário', async () => {
        prisma.usuario.findUnique.mockResolvedValue(null);
        prisma.usuario.create.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com' });
        bcryptjs.hash.mockResolvedValue('hashedpassword');

        const response = await request(app)
            .post('/api/users/register')
            .send({ nome: 'Test User', email: 'test@example.com', senha: 'password123' });

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.usuario.create).toHaveBeenCalledWith({
            data: {
                nome: 'Test User',
                email: 'test@example.com',
                senha: 'hashedpassword',
            },
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({ message: 'Usuário criado com sucesso!' }));
    });

    test('POST /api/users/login deve fazer login de um usuário', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com', senha: 'hashedpassword' });
        bcryptjs.compare.mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('token');

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', senha: 'password123' });

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 1, email: 'test@example.com' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ message: 'Login realizado com sucesso!' }));
    });

    test('POST /api/users/request-password-reset deve solicitar recuperação de senha', async () => {
        prisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'Test User', email: 'test@example.com' });
        bcryptjs.hash.mockResolvedValue('resettoken');
        sendEmail.mockResolvedValue(true);

        const response = await request(app)
            .post('/api/users/request-password-reset')
            .send({ email: 'test@example.com' });

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
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ message: 'E-mail de recuperação enviado com sucesso!' }));
    });

    test('POST /api/users/reset-password deve redefinir a senha', async () => {
        prisma.usuario.findFirst.mockResolvedValue({
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            resetToken: 'validtoken',
            resetExpires: new Date(Date.now() + 3600000),
        });
        bcryptjs.hashSync.mockReturnValue('hashednewpassword');

        const response = await request(app)
            .post('/api/users/reset-password')
            .send({ token: 'validtoken', novaSenha: 'newpassword123' });

        expect(prisma.usuario.findFirst).toHaveBeenCalledWith({
            where: {
                resetToken: { not: null }, // Corrigido para refletir a implementação
                resetExpires: { gt: expect.any(Date) },
            },
        });
        expect(bcryptjs.hashSync).toHaveBeenCalledWith('newpassword123', 10);
        expect(prisma.usuario.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { senha: 'hashednewpassword', resetToken: null, resetExpires: null },
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ message: 'Senha redefinida com sucesso!' }));
    });
});