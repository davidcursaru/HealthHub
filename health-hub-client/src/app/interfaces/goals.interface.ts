export interface Goals {
    id: number;
    userId: number;
    goalType: string;
    targetValue: number;
    progress: number;
    deadline: Date;
}