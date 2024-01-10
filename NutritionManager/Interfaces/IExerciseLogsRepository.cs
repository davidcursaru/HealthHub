using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IExerciseLogsRepository
    {
        Task<ExerciseLogs> CreateExercise(ExerciseLogs exercise);
        Task<IEnumerable<ExerciseLogs>> GetAllExercisesLogsAsync();
        Task<ExerciseLogs> GetExerciseLogsByIdAsync(int id);
        Task<IEnumerable<ExerciseLogs>> GetAllExercisesByUserId(int userId);
        Task<IEnumerable<ExerciseLogs>> GetExerciseLogsInterval(int userId, DateTime startDate, DateTime endDate);
        Task<double> GetTotalBurnedCaloriesSum(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate);
        Task<string> GetExerciseData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate);
        Task DeleteExerciseAsync(int id);
        Task UpdateExerciseAsync(ExerciseLogs exercise);
    }
}
