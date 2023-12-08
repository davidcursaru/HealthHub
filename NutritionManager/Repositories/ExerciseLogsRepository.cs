using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Repositories
{
    public class ExerciseLogsRepository : IExerciseLogsRepository
    {
        private readonly DataContext _context;

        public ExerciseLogsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<ExerciseLogs> CreateExercise(ExerciseLogs exercise)
        {
            _context.ExerciseLogs.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task DeleteExerciseAsync(int id)
        {
            var exerciseToDelete = GetExerciseLogsByIdAsync(id);
            _context.Remove(exerciseToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ExerciseLogs>> GetAllExercisesLogsAsync()
        {
            return await _context.ExerciseLogs.ToListAsync();
        }

        public async Task<ExerciseLogs> GetExerciseLogsByIdAsync(int id)
        {
            return await _context.ExerciseLogs.FindAsync(id);
        }

        public async Task<IEnumerable<ExerciseLogs>> GetAllExercisesByUserId(int userId)
        {
            var exercises = await _context.ExerciseLogs.Where(e => e.UserId == userId).ToListAsync();
            return exercises;
        }

        public async Task UpdateExerciseAsync(ExerciseLogs exercise)
        {
            _context.Update(exercise);
            await _context.SaveChangesAsync();
        }
    }
}
