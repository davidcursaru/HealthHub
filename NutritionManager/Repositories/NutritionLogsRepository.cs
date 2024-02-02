using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Text.Json;

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

        public async Task DeleteNutritionLogs(int logId, int userId)
        {
            var logToDelete = await _context.NutritionLogs
                .FirstOrDefaultAsync(x => x.Id == logId && x.UserId == userId);

            if (logToDelete != null)
            {
                _context.NutritionLogs.Remove(logToDelete);
                await _context.SaveChangesAsync();
            }
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

        public async Task<string> GetNutritionData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            IEnumerable<NutritionLogs> nutritionLogs = await GetNutritionLogsInterval(userId, startDate, endDate);

            List<object> nutritionDataList = new List<object>();

            foreach (var food in nutritionLogs)
            {
                var nutritionData = new
                {
                    name = food.FoodConsumed,
                    grams = food.Grams,
                    calories = food.Calories,
                    date = food.ConsumptionDate,
                    logId = food.Id
                };

                nutritionDataList.Add(nutritionData);
            }

            return JsonSerializer.Serialize(nutritionDataList);
        }

        public async Task<double> GetNutritionLogsTotalCalories(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var calories = await _context.NutritionLogs
                .Where(r => r.ConsumptionDate >= startDate.Date && r.ConsumptionDate <= endDate.Date && r.UserId == userId)
                .Select(r => r.Calories)
                .SumAsync();

            return calories;
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
