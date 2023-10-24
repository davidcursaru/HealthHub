namespace NutritionManager.Entities
{
    public class Reminders
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ReminderType { get; set; }
        public DateTime ReminderDate { get; set; }
        public string ReminderMessage { get; set; }
    }
}
