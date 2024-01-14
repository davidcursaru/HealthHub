export interface SleepData {
    bucket: {
        startTimeMillis: string;
        endTimeMillis: string;
        dataset: {
            dataSourceId: string;
            point: {
                startTimeNanos: string;
                endTimeNanos: string;
                dataTypeName: string;
                originDataSourceId: string;
                value: {
                    intVal: number;
                    mapVal: any[]; // You might want to provide a specific type for mapVal
                }[];
            }[];
        }[];
    }[];
}