namespace NutritionManager.DTO
{
    public class RemindersDTO
    {
        public int Id { get; set; }
        public string ReminderType { get; set; }
        public DateTime StartActivity { get; set; }
        public DateTime EndActivity { get; set; }
    }
}