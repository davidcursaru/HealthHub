using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesLogsController
    {
        private readonly IExerciseLogsRepository _exerciseLogsRepository;

        public ExercisesLogsController(IExerciseLogsRepository exerciseLogsRepository)
        {
            _exerciseLogsRepository = exerciseLogsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<ExerciseLogs>> GetAllExercisesLogsAsync()
        {
            return await _exerciseLogsRepository.GetAllExercisesLogsAsync();
        }

        [HttpGet("userId/{userId}")]
        public async Task<IEnumerable<ExerciseLogs>> GetAllExercisesByUserIdAsync(int userId)
        {
            return await _exerciseLogsRepository.GetAllExercisesByUserId(userId);
        }

        [HttpGet("id")]
        public async Task<ExerciseLogs> GetExerciseLogsByIdAsync(int id)
        {
            return await _exerciseLogsRepository.GetExerciseLogsByIdAsync(id);
        }

        [HttpPost]
        public async Task<ExerciseLogs> CreateExerciseLogsAsync(ExerciseLogs exerciseLogs)
        {
            return await _exerciseLogsRepository.CreateExercise(exerciseLogs);
        }

        [HttpPut]
        public async Task UpdateExerciseLogsAsync(ExerciseLogs exerciseLogs)
        {
            await _exerciseLogsRepository.UpdateExerciseAsync(exerciseLogs);
        }

        [HttpDelete]
        public async Task DeleteExerciseLogsAsync(int id)
        {
            await _exerciseLogsRepository.DeleteExerciseAsync(id);
        }
    }
}
