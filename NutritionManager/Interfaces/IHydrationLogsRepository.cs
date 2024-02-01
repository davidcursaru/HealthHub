using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IHydrationLogsRepository
    {
        Task<HydrationLogs> CreateHydrationLogs(HydrationLogs hydrationLogs);
        Task<IEnumerable<HydrationLogs>> GetAllHydrationLogs();
        Task<IEnumerable<HydrationLogs>> GetAllHydrationLogsByUserId(int userId);
        Task<int> GetHydrationLogsCount(int userId, DateTime startDate, DateTime endDate);
        Task<HydrationLogs> GetHydrationLogsById(int id);
        Task DeleteHydrationLogs(int logId, int userId);
        Task UpdateHydrationLogs(HydrationLogs hydrationLogs);
    }
}
