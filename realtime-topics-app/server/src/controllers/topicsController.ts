import { Request, Response } from 'express';
import { TopicsService } from '../services/topicsService';
import { Topic } from '../models/topic';

export class TopicsController {
    private topicsService: TopicsService;

    constructor() {
        this.topicsService = new TopicsService();
    }

    public async createTopic(req: Request, res: Response): Promise<void> {
        const topicData: Topic = req.body;
        const newTopic = await this.topicsService.createTopic(topicData);
        res.status(201).json(newTopic);
    }

    public async updateTopic(req: Request, res: Response): Promise<void> {
        const topicId: string = req.params.id;
        const updatedData: Topic = req.body;
        const updatedTopic = await this.topicsService.updateTopic(topicId, updatedData);
        res.status(200).json(updatedTopic);
    }

    public async getTopics(req: Request, res: Response): Promise<void> {
        const topics = await this.topicsService.getTopics();
        res.status(200).json(topics);
    }

    public async getTopicById(req: Request, res: Response): Promise<void> {
        const topicId: string = req.params.id;
        const topic = await this.topicsService.getTopicById(topicId);
        if (topic) {
            res.status(200).json(topic);
        } else {
            res.status(404).json({ message: 'Topic not found' });
        }
    }
}