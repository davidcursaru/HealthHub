using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesApiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IExerciseLogsRepository _exerciseLogsRepository;

        public ExercisesApiController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IExerciseLogsRepository exerciseLogsRepository)
        {
            _exerciseLogsRepository = exerciseLogsRepository;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://api.api-ninjas.com/v1/");
            _configuration = configuration;
        }

        [HttpGet("caloriesburned")]
        public async Task<ActionResult<string>> GetExerciseData(string activity)
        {
            try
            {
                string apiKey = _configuration["NinjasAPIKey:APIKey"];

                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", apiKey);

                HttpResponseMessage response = await _httpClient.GetAsync($"caloriesburned?activity={activity}");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    return Ok(result); // Return the response data
                }
                else
                {
                    return StatusCode((int)response.StatusCode, $"Error: {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Exception: {ex.Message}");
            }
        }

        [HttpGet("intervalCalories")]
        public async Task<string> GetCaloriesInterval(int userId, DateTime startDate, DateTime endDate)
        {
            IEnumerable<ExerciseLogs> exerciseLogs = _exerciseLogsRepository.GetExerciseLogsInterval(userId, startDate, endDate).Result;
            int caloriesSum = 0;
            int totalMinutes = 0;
            string apiKey = _configuration["NinjasAPIKey:APIKey"];
            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", apiKey);

            List<int> tmp = new();
            List<object> exercises = new();

            for (int i = 0; i < exerciseLogs.Count(); i++)
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"caloriesburned?activity={exerciseLogs.ElementAt(i).ExerciseType}");

                string result = await response.Content.ReadAsStringAsync();

                JsonDocument doc = JsonDocument.Parse(result);

                JsonElement root = doc.RootElement;

                if (root.ValueKind == JsonValueKind.Array)
                {
                    var firstElement = root[0];
                    int totalCalories = firstElement.GetProperty("total_calories").GetInt32();
                    tmp.Add(totalCalories);
                }

                var burnedCalories = CalculateBurnedCalories(tmp[i], exerciseLogs.ElementAt(i).ExerciseDuration);
                caloriesSum += burnedCalories;
                totalMinutes += exerciseLogs.ElementAt(i).ExerciseDuration;

                var exercise = new
                {
                    Name = exerciseLogs.ElementAt(i).ExerciseType.ToString(),
                    CaloriesBurned = burnedCalories,
                    Duration = exerciseLogs.ElementAt(i).ExerciseDuration
                };
                exercises.Add(exercise);
            }

            var exercisesData = new
            {
                CaloriesSum = caloriesSum,
                TotalMinutes = totalMinutes,
                Exercises = exercises
            };

            return JsonSerializer.Serialize(exercisesData); // Return a default value or handle this case according to your logic
        }

        public int CalculateBurnedCalories(int caloriesPerHour, int duration)
        {
            return duration * caloriesPerHour / 60;
        }
    }
}
