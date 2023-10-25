namespace NutritionManager.DTO
{
    public class NutritionLogsDTO
    {
        public int Id { get; set; }
        public DateTime ConsumptionDate { get; set; }
        public string FoodConsumed { get; set; }
        public int Grams { get; set; }
        public int Calories { get; set; }
    }
}