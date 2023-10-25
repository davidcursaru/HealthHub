namespace NutritionManager.DTO
{
    public class GoalsDTO
    {
        public int Id { get; set; }
        public string GoalType { get; set; }
        public int TargetValue { get; set; }
        public int Progress { get; set; }
        public DateTime Deadline { get; set; }
    }
}