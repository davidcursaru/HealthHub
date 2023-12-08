using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IExerciseLogsRepository
    {
        Task<ExerciseLogs> CreateExercise(ExerciseLogs exercise);
        Task<IEnumerable<ExerciseLogs>> GetAllExercisesLogsAsync();
        Task<ExerciseLogs> GetExerciseLogsByIdAsync(int id);
        Task<IEnumerable<ExerciseLogs>> GetAllExercisesByUserId(int userId);
        Task DeleteExerciseAsync(int id);
        Task UpdateExerciseAsync(ExerciseLogs exercise);
    }
}
