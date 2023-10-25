namespace NutritionManager.DTO
{
    public class ExerciseLogsDTO
    {
        public int Id { get; set; }
        public DateTime ExerciseDate { get; set; }
        public string ExerciseType { get; set; }
        public string ExerciseDuration { get; set; }
        public int CaloriesBurned { get; set; }
    }
}