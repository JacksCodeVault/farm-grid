require('dotenv').config();

module.exports = {
    app: {
        name: process.env.APP_NAME || 'FarmGrid',
        port: process.env.PORT || 3333,
        env: process.env.NODE_ENV || 'development',
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        name: process.env.DB_NAME || 'farmgrid_dev',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'supersecretjwtkey',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
    email: {
        mailer: process.env.MAIL_MAILER || 'smtp',
        host: process.env.MAIL_HOST || 'smtp.mailgun.org',
        port: parseInt(process.env.MAIL_PORT, 10) || 587,
        username: process.env.MAIL_USERNAME || 'postmaster@pixelacademyafrica.uk',
        password: process.env.MAIL_PASSWORD || 'pixelacademy@2025!*',
        encryption: process.env.MAIL_ENCRYPTION || 'tls',
        fromAddress: process.env.MAIL_FROM_ADDRESS || 'postmaster@pixelacademyafrica.uk',
        fromName: process.env.APP_NAME || 'FarmGrid',
    },
};
