import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { TopicsController } from './controllers/topicsController';
import { createServer } from './ws';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const topicsController = new TopicsController(io);

app.use(express.json());

// Define routes for topics
app.get('/api/topics', topicsController.getTopics.bind(topicsController));
app.post('/api/topics', topicsController.createTopic.bind(topicsController));
app.put('/api/topics/:id', topicsController.updateTopic.bind(topicsController));

createServer(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});