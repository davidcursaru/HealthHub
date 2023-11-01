using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IHydrationLogsRepository
    {
        Task<HydrationLogs> CreateHydrationLogs(HydrationLogs hydrationLogs);
        Task<IEnumerable<HydrationLogs>> GetAllHydrationLogs();
        Task<HydrationLogs> GetHydrationLogsById(int id);
        Task DeleteHydrationLogs(int id);
        Task UpdateHydrationLogs(HydrationLogs hydrationLogs);
    }
}
