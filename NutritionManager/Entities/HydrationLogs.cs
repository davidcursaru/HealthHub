namespace NutritionManager.Entities
{
    public class HydrationLogs
    {
        public int Id{ get; set; }
        public int UserId{ get; set; }
        public DateTime HydrationDate { get; set; }
        public int Liters { get; set; }
    }
}
