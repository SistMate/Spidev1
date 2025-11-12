export interface Topic {
    id: string;
    title: string;
    content: string;
    modifiedBy: string; // User ID or name of the teacher who modified the topic
    modifiedAt: Date; // Timestamp of the last modification
}

export interface User {
    id: string;
    name: string;
}