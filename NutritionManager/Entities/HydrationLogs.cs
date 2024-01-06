namespace NutritionManager.Entities
{
    public class HydrationLogs
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime HydrationDate { get; set; } = DateTime.Now;
        public int Liters { get; set; }
    }
}
