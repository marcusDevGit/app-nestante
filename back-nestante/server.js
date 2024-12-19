const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log('Banco de dados conectado com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseConnection();
