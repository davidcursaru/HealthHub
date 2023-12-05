using NutritionManager.Extensions;

namespace NutritionManager.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Weight { get; set; }
        public string Height { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }

        public List<GoalsDTO> Goals { get; set; }
        public List<ExerciseLogsDTO> ExerciseLogs { get; set; }
        public List<HydrationLogsDTO> HydrationLogs { get; set; }
        public List<NutritionLogsDTO> NutritionLogs { get; set; }
        public List<RemindersDTO> Reminders { get; set; }
    }
}
