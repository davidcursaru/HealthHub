namespace NutritionManager.Entities
{
    public class NutritionLogs
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime ConsumptionDate { get; set; }
        public string FoodConsumed { get; set; }
        public int Grams { get; set; }
    }
}
