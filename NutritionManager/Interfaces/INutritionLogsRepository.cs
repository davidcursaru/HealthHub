using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface INutritionLogsRepository
    {
        Task<NutritionLogs> CreateNutritionLogs(NutritionLogs nutritionLogs);
        Task<IEnumerable<NutritionLogs>> GetAllNutritionLogs();
        Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsByUserId(int userId);
        Task<IEnumerable<NutritionLogs>> GetNutritionLogsInterval(int userId, DateTime startDate, DateTime endDate);
        Task<double> GetNutritionLogsTotalCalories(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate);
        Task<string> GetNutritionData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate);
        Task<NutritionLogs> GetNutritionLogsById(int id);
        Task UpdateNutritionLogs(NutritionLogs newNutritionLogs);
        Task DeleteNutritionLogs(int logId, int userId);
    }
}
