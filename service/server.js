import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
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

// Jalankan server
server.listen(PORT, () => {
    console.log(`Service is running on port ${PORT}`);
});