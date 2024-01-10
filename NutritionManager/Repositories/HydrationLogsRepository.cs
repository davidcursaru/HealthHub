using Microsoft.AspNetCore.Mvc;
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

        public async Task<IEnumerable<HydrationLogs>> GetAllHydrationLogsByUserId(int userId)
        {
            var hydrationLogs = await _context.HydrationLogs.Where(h => h.UserId == userId).ToListAsync();
            return hydrationLogs;
        }

        public async Task<HydrationLogs> GetHydrationLogsById(int id)
        {
            return await _context.HydrationLogs.FindAsync(id);
        }

        public async Task<int> GetHydrationLogsCount(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if
            (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var quantity = await _context.HydrationLogs
                .Where(r => r.HydrationDate >= startDate.Date && r.HydrationDate <= endDate.Date && r.UserId == userId)
                .Select(r => r.Liters)
                .SumAsync();

            return quantity;
        }

        public async Task UpdateHydrationLogs(HydrationLogs hydrationLogs)
        {
            _context.Update(hydrationLogs);
            await _context.SaveChangesAsync();
        }
    }
}
