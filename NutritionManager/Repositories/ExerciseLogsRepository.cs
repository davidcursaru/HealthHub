using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Text.Json;

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

        public async Task<IEnumerable<ExerciseLogs>> GetExerciseLogsInterval(int userId, DateTime startDate, DateTime endDate)
        {
            if
            (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var exerciseLogs = await _context.ExerciseLogs
                .Where(r => r.ExerciseDate >= startDate.Date && r.ExerciseDate <= endDate.Date && r.UserId == userId).ToListAsync();

            return exerciseLogs;
        }

        public async Task<ExerciseLogs> GetExerciseLogsByIdAsync(int id)
        {
            return await _context.ExerciseLogs.FindAsync(id);
        }

        public async Task<string> GetTotalBurnedCaloriesSum(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }


            var calories = await _context.ExerciseLogs
                .Where(r => r.ExerciseDate >= startDate.Date && r.ExerciseDate <= endDate.Date && r.UserId == userId)
                .Select(r => r.BurnedCalories)
                .SumAsync();
            var duration = await _context.ExerciseLogs
               .Where(r => r.ExerciseDate >= startDate.Date && r.ExerciseDate <= endDate.Date && r.UserId == userId)
               .Select(r => r.ExerciseDuration)
               .SumAsync();
            var heartMinutes = await _context.ExerciseLogs
              .Where(r => r.ExerciseDate >= startDate.Date && r.ExerciseDate <= endDate.Date && r.UserId == userId)
              .Select(r => r.HeartMinutes)
              .SumAsync();

            var exerciseData = new
            {
                
                Duration = duration,
                Burned_calories = calories,
                HeartMinutes = heartMinutes
            };


            return JsonSerializer.Serialize(exerciseData);
        }

        public async Task<string> GetExerciseData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            IEnumerable<ExerciseLogs> exerciseLogs = await GetExerciseLogsInterval(userId, startDate, endDate);

            List<object> exerciseDataList = new List<object>();

            foreach (var exercise in exerciseLogs)
            {
                var exerciseData = new
                {
                    name = exercise.ExerciseType,
                    duration = exercise.ExerciseDuration,
                    burned_calories = exercise.BurnedCalories,
                    heart_minutes = exercise.HeartMinutes,
                };

                exerciseDataList.Add(exerciseData);
            }

            return JsonSerializer.Serialize(exerciseDataList);
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
