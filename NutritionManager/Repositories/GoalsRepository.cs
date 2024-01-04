using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Repositories
{
    public class GoalsRepository : IGoalsRepository
    {
        private readonly DataContext _context;

        public GoalsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Goals> CreateGoal(Goals goal)
        {
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task DeleteGoalAsync(int id)
        {
            var goalToDelete = GetGoalByIdAsync(id).Result;
            _context.Remove(goalToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Goals>> GetAllGoalsAsync()
        {
            return await _context.Goals.ToListAsync();
        }

        public async Task<IEnumerable<Goals>> GetAllGoalsByUserId(int userId)
        {
            var goals = await _context.Goals.Where(g => g.UserId == userId).ToListAsync();
            return goals;
        }

        public async Task<Goals> GetGoalByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public async Task<int> GetGoalsTotalValueForCurrentDay(string goalType, int userId)
        {
            var totalValue = await _context.Goals
                .Where(g => g.UserId == userId && g.GoalType == goalType && (g.StartGoalDate.DayOfYear == DateTime.Now.DayOfYear && g.StartGoalDate.Year == DateTime.Now.Year) && (g.Deadline.DayOfYear == DateTime.Now.DayOfYear && g.Deadline.Year == DateTime.Now.Year))
                .Select(g => g.TargetValue).SumAsync();
            return totalValue;
        }

        public async Task<int> GetGoalsValueForInterval(int userId, string goalType, DateTime startDate, DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var goals = await _context.Goals
                .Where(r => r.StartGoalDate >= startDate.Date
                && r.Deadline <= endDate.Date
                && r.UserId == userId
                && r.GoalType == goalType)
                .Select(g => g.TargetValue).SumAsync();

            return goals;
        }

        public async Task UpdateGoalAsync(Goals goals)
        {
            _context.Update(goals);
            await _context.SaveChangesAsync();
        }
    }
}
