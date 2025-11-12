import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Topic } from '../types';

interface TopicEditorProps {
  topic: Topic;
  onUpdate: (updatedTopic: Topic) => void;
}

const TopicEditor: React.FC<TopicEditorProps> = ({ topic, onUpdate }) => {
  const [title, setTitle] = useState(topic.title);
  const [content, setContent] = useState(topic.content);
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    setTitle(topic.title);
    setContent(topic.content);
  }, [topic]);

  const handleSave = () => {
    const updatedTopic = { ...topic, title, content };
    onUpdate(updatedTopic);
    sendMessage(JSON.stringify({ action: 'update', topic: updatedTopic }));
  };

  return (
    <div>
      <h2>Edit Topic</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TopicEditor;