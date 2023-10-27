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

        public async Task<Goals> GetGoalByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public async Task UpdateGoalAsync(Goals goals)
        {
            _context.Update(goals);
            await _context.SaveChangesAsync();
        }
    }
}
