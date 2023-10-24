using Microsoft.EntityFrameworkCore;
using NutritionManager.Entities;

namespace NutritionManager.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Goals> Goals { get; set; }
        public DbSet<ExerciseLogs> ExerciseLogs { get; set; }
        public DbSet<HydrationLogs> HydrationLogs { get; set; }
        public DbSet<NutritionLogs> NutritionLogs { get; set; }
        public DbSet<Reminders> Reminders { get; set; }
    }
}
