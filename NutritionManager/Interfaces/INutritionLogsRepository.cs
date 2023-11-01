using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface INutritionLogsRepository
    {
        Task<NutritionLogs> CreateNutritionLogs(NutritionLogs nutritionLogs);
        Task<IEnumerable<NutritionLogs>> GetAllNutritionLogs();
        Task<NutritionLogs> GetNutritionLogsById(int id);
        Task UpdateNutritionLogs(NutritionLogs newNutritionLogs);
        Task DeleteNutritionLogs(int id);
    }
}
