namespace NutritionManager.Entities
{
    public class ExerciseLogs
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime ExerciseDate { get; set; }
        public string ExerciseType { get; set; }
        public int ExerciseDuration { get; set; }
        public double BurnedCalories { get; set; }
        public int HeartMinutes { get; set; }
    }
}
