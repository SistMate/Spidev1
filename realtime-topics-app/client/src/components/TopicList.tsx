import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Topic } from '../types';

const TopicList: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const { sendMessage, onMessage } = useWebSocket();

    useEffect(() => {
        // Fetch initial topics from the server
        const fetchTopics = async () => {
            const response = await fetch('/api/topics');
            const data = await response.json();
            setTopics(data);
        };

        fetchTopics();

        // Handle incoming WebSocket messages
        onMessage((message: string) => {
            const updatedTopic: Topic = JSON.parse(message);
            setTopics((prevTopics) =>
                prevTopics.map((topic) =>
                    topic.id === updatedTopic.id ? updatedTopic : topic
                )
            );
        });
    }, [onMessage]);

    const handleEdit = (topic: Topic) => {
        // Logic to edit the topic
        sendMessage(JSON.stringify(topic));
    };

    return (
        <div>
            <h2>Topics</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>
                        <h3>{topic.title}</h3>
                        <p>{topic.content}</p>
                        <button onClick={() => handleEdit(topic)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicList;