using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Repositories
{
    public class HydrationLogsRepository : IHydrationLogsRepository
    {
        private readonly DataContext _context;

        public HydrationLogsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<HydrationLogs> CreateHydrationLogs(HydrationLogs hydrationLogs)
        {
            _context.Add(hydrationLogs);
            await _context.SaveChangesAsync();
            return hydrationLogs;
        }

        public async Task DeleteHydrationLogs(int id)
        {
            var hydrationLogsToDelete = GetHydrationLogsById(id).Result;
            _context.HydrationLogs.Remove(hydrationLogsToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<HydrationLogs>> GetAllHydrationLogs()
        {
            return await _context.HydrationLogs.ToListAsync();
        }

        public async Task<HydrationLogs> GetHydrationLogsById(int id)
        {
            return await _context.HydrationLogs.FindAsync(id);
        }

        public async Task UpdateHydrationLogs(HydrationLogs hydrationLogs)
        {
            _context.Update(hydrationLogs);
            await _context.SaveChangesAsync();
        }
    }
}
