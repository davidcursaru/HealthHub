import { ExerciseLogs } from "./exerciseLogs.interface";
import { Goals } from "./goals.interface";
import { HydrationLogs } from "./hydrationLogs.interface";
import { NutritionLogs } from "./nutritionLogs.interface";
import { Reminders } from "./reminders.interface";

export interface User{
    id?: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    age?: Date;
    weight?: string;
    height?: string;
    gender?: string;
    token?: string;

}