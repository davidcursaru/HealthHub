using NutritionManager.Extensions;

namespace NutritionManager.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Weight { get; set; }
        public string Height { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }

        public ICollection<Goals> Goals { get; set; }
        public ICollection<ExerciseLogs> ExerciseLogs { get; set; }
        public ICollection<HydrationLogs> HydrationLogs { get; set; }
        public ICollection<NutritionLogs> NutritionLogs { get; set; }
        public ICollection<Reminders> Reminders { get; set; }

        public int GetAge()
        {
            return DateOfBirth.CalculateAge();
        }
    }
}
