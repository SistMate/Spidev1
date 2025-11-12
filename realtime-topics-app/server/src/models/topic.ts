export interface Topic {
    id: string;
    title: string;
    content: string;
    modifiedBy: string; // User ID or username of the teacher making modifications
    modifiedAt: Date; // Timestamp of the last modification
}