namespace NutritionManager.Entities
{
    public class Goals
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string GoalType { get; set; }
        public int TargetValue { get; set; }
        public DateTime StartGoalDate { get; set; }
        public DateTime Deadline { get; set; }
    }
}
