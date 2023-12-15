using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

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
    }
}
