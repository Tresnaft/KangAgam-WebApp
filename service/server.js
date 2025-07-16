import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import topicsRouter from './src/routes/TopicRoutes.js';
import entryRouter from './src/routes/EntryRoutes.js';
import languageRouter from './src/routes/LanguageRoutes.js';

// Express dan Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
app.use('/api/topics', topicsRouter);
app.use('/api/topics/:topicId/entries', entryRouter);
app.use('/api/languages', languageRouter);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kang Agam API Documentation',
            version: '0.1.0',
            description: 'API documentation for Kang Agam Web App',
            contact: {
                name: 'Tresh',
                email: 'tresnaft.13@gmail.com'
            },
        },

        servers: [
            {
                url: `http://localhost:${PORT}/`
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Path ke file yang berisi anotasi Swagger
};
const spacs = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spacs));

// Jalankan server
server.listen(PORT, () => {
    console.log(`Service is running on port ${PORT}`);
});