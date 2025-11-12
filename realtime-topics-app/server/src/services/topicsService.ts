export class TopicsService {
    private topics: Map<string, { title: string; content: string; user: string }> = new Map();

    public createTopic(id: string, title: string, content: string, user: string) {
        this.topics.set(id, { title, content, user });
        return this.topics.get(id);
    }

    public updateTopic(id: string, title: string, content: string, user: string) {
        if (this.topics.has(id)) {
            this.topics.set(id, { title, content, user });
            return this.topics.get(id);
        }
        throw new Error('Topic not found');
    }

    public getTopic(id: string) {
        return this.topics.get(id);
    }

    public getAllTopics() {
        return Array.from(this.topics.entries()).map(([id, topic]) => ({ id, ...topic }));
    }

    public notifyUpdate(id: string, user: string) {
        // Logic to notify connected users about the update
        // This could involve emitting a WebSocket event
    }
}