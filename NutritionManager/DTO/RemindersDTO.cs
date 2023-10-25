namespace NutritionManager.DTO
{
    public class RemindersDTO
    {
        public int Id { get; set; }
        public string ReminderType { get; set; }
        public DateTime ReminderDate { get; set; }
        public string ReminderMessage { get; set; }
    }
}