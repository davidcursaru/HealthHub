using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IGoalsRepository
    {
        Task<Goals> CreateGoal(Goals goal);
        Task<IEnumerable<Goals>> GetAllGoalsAsync();
        Task<IEnumerable<Goals>> GetAllGoalsByUserId(int userId);
        Task<Goals> GetGoalByIdAsync(int id);
        Task<int> GetGoalsTotalValueForCurrentDay(string goalType, int userId);
        Task<int> GetGoalsValueForInterval(int userId, string goalType, DateTime startDate, DateTime endDate);
        Task<string> GetGoalsData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate);
        Task UpdateGoalAsync(Goals goals);
        Task DeleteGoals(int logId, int userId);
    }
}
