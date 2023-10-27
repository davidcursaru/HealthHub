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

        public Task DeleteGoalAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Goals>> GetAllGoalsAsync()
        {
            return await _context.Goals.ToListAsync();
        }

        public async Task<Goals> GetGoalByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public Task UpdateGoalAsync(GoalsDTO goalsDTO)
        {
            throw new NotImplementedException();
        }
    }
}
