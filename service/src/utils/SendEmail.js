import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Buat Transporter (Layanan yang akan mengirim email, cth: Gmail, SendGrid)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Definisikan Opsi Email (Penerima, Pengirim, Subjek, Isi)
    const mailOptions = {
        from: 'Admin Kang Agam <admin@kang-agam.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Kirim Email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;