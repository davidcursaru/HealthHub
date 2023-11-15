export interface NutritionLogs {
    id: number;
    userId: number;
    consumptiondate: Date;
    foodConsumed: string;
    grams: number;
    calories: number;
}