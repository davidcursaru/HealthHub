using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using NutritionManager.Repositories;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalsRepository _goalsRepository;

        public GoalsController(IGoalsRepository goalsRepository)
        {
            _goalsRepository = goalsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Goals>> GetAllGoalsAsync()
        {
            return await _goalsRepository.GetAllGoalsAsync();
        }

        [HttpGet("userId/{userId}")]
        public async Task<IEnumerable<Goals>> GetAllGoalsByUserIdAsync(int userId)
        {
            return await _goalsRepository.GetAllGoalsByUserId(userId);
        }

        [HttpGet("currentDayValue")]
        public async Task<int> GetGoalsTotalValueForCurrentDayAsync(string goalType, int userId)
        {
            return await _goalsRepository.GetGoalsTotalValueForCurrentDay(goalType, userId);
        }

        [HttpGet("interval")]
        public async Task<int> GetGoalsValueForIntervalAsync(int userId, string goalType, DateTime startDate, DateTime endDate)
        {
            return await _goalsRepository.GetGoalsValueForInterval(userId, goalType, startDate, endDate);
        }

        [HttpGet("goals-data-interval")]
        public async Task<string> GetGoalsDataAsync(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            return await _goalsRepository.GetGoalsData(userId, startDate, endDate);
        }

        [HttpPost]
        public async Task<Goals> CreateGoalAsync(Goals goal)
        {
            return await _goalsRepository.CreateGoal(goal);
        }

        [HttpPut]
        public async Task UpdateGoalAsync(Goals goals)
        {
            await _goalsRepository.UpdateGoalAsync(goals);
        }

        [HttpDelete]
        public async Task DeleteGoalsAsync(int logId, int userId)
        {
            await _goalsRepository.DeleteGoals(logId, userId);
        }
    }
}
