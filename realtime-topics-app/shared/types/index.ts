export interface Topic {
    id: string;
    title: string;
    content: string;
    modifiedBy: User;
    modifiedAt: Date;
}

export interface User {
    id: string;
    name: string;
}