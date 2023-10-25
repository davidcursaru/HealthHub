namespace NutritionManager.DTO
{
    public class HydrationLogsDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime HydrationDate { get; set; }
        public int Liters { get; set; }
    }
}