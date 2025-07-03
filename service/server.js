import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

// Tambahkan rute sederhana untuk testing
app.get("/api", (req, res) => {
    res.json({ message: "Hello from service!" });
});

// Jalankan server
server.listen(PORT, () => {
    console.log(`Service is running on port ${PORT}`);
});