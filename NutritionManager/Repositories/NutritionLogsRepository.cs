using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Repositories
{
    public class NutritionLogsRepository : INutritionLogsRepository
    {
        private readonly DataContext _context;

        public NutritionLogsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<NutritionLogs> CreateNutritionLogs(NutritionLogs nutritionLogs)
        {
            _context.Add(nutritionLogs);
            await _context.SaveChangesAsync();
            return nutritionLogs;
        }

        public async Task DeleteNutritionLogs(int id)
        {
            var nutritionLogsToDelete = GetNutritionLogsById(id).Result;
            _context.NutritionLogs.Remove(nutritionLogsToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<NutritionLogs>> GetAllNutritionLogs()
        {
            return await _context.NutritionLogs.ToListAsync();
        }

        public async Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsByUserId(int userId)
        {
            var nutritionLogs = await _context.NutritionLogs.Where(n => n.UserId == userId).ToListAsync();
            return nutritionLogs;
        }

        public async Task<IEnumerable<NutritionLogs>> GetNutritionLogsInterval(int userId, DateTime startDate, DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var nutritionLogs = await _context.NutritionLogs
                .Where(r => r.ConsumptionDate >= startDate.Date && r.ConsumptionDate <= endDate.Date && r.UserId == userId).ToListAsync();

            return nutritionLogs;
        }

        public async Task<NutritionLogs> GetNutritionLogsById(int id)
        {
            return await _context.NutritionLogs.FindAsync(id);
        }

        public async Task UpdateNutritionLogs(NutritionLogs newNutritionLogs)
        {
            _context.Update(newNutritionLogs);
            await _context.SaveChangesAsync();
        }
    }
}
