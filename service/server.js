import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import topicsRouter from './src/routes/TopicRoutes.js';
import languageRouter from './src/routes/LanguageRoutes.js';

// Express dan Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"] // Izinkan metode lain
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());

// FIX: Hapus body-parser JSON global.
// app.use(express.json()); // JANGAN GUNAKAN INI SECARA GLOBAL

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    console.log(`Connected to database: '${connection.db.databaseName}'`);
});

// Tambahkan rute sederhana untuk testing
app.get("/api", (req, res) => {
    res.json({ message: "Hello from service!" });
});

// --- PENDAFTARAN RUTE ---

// Rute ini menggunakan multer, jadi JANGAN gunakan express.json() di sini.
// Biarkan multer yang menangani body parsing untuk rute ini.
app.use('/api/topics', topicsRouter);

// Rute ini hanya menerima JSON, jadi AMAN untuk menggunakan express.json() di sini.
app.use('/api/languages', express.json(), languageRouter);


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kang Agam API Documentation',
      version: '0.1.0',
      description: 'API documentation for Kang Agam Web App',
    },
    servers: [ { url: `http://localhost:${PORT}/` } ]
  },
  apis: ['./src/routes/*.js']
};
const spacs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spacs));

// Jalankan server
server.listen(PORT, () => {
    console.log(`Service is running on port ${PORT}`);
});