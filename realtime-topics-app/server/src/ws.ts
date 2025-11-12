import WebSocket from 'ws';
import { Server } from 'http';
import { TopicsService } from './services/topicsService';

const wss = new WebSocket.Server({ noServer: true });
const topicsService = new TopicsService();

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'updateTopic') {
            const { topicId, title, content, user } = data;
            topicsService.updateTopic(topicId, title, content, user);
            broadcastUpdate(topicId, title, content, user);
        }
    });
});

const broadcastUpdate = (topicId, title, content, user) => {
    const message = JSON.stringify({
        type: 'topicUpdated',
        topicId,
        title,
        content,
        user,
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

export const handleUpgrade = (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
};