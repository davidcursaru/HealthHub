using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface INutritionLogsRepository
    {
        Task<NutritionLogs> CreateNutritionLogs(NutritionLogs nutritionLogs);
        Task<IEnumerable<NutritionLogs>> GetAllNutritionLogs();
        Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsByUserId(int userId);
        Task<IEnumerable<NutritionLogs>> GetNutritionLogsInterval(int userId, DateTime startDate, DateTime endDate);
        Task<NutritionLogs> GetNutritionLogsById(int id);
        Task UpdateNutritionLogs(NutritionLogs newNutritionLogs);
        Task DeleteNutritionLogs(int id);
    }
}
