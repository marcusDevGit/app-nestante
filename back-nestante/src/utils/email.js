const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Servidor SMTP do Mailtrap
    port: process.env.MAILTRAP_PORT, // Porta do Mailtrap
    auth: {
        user: process.env.MAILTRAP_USER, // Usuário do Mailtrap
        pass: process.env.MAILTRAP_PASS, // Senha do Mailtrap
    },
    tls: {
        rejectUnauthorized: false, // Não verificar o certificado SSL
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"App Productividade" <no-reply@app.com>', // Endereço de remetente
            to, // Destinatário
            subject, // Assunto
            text, // Conteúdo do e-mail
        });
        console.log("E-mail enviado: %s", info.messageId);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw error;
    }
};

module.exports = { sendEmail };