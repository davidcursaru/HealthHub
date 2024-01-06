using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodApiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly INutritionLogsRepository _nutritionLogsRepository;

        public FoodApiController(IHttpClientFactory httpClientFactory, IConfiguration configuration, INutritionLogsRepository nutritionLogsRepository)
        {
            _nutritionLogsRepository = nutritionLogsRepository;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://api.api-ninjas.com/v1/");
            _configuration = configuration;
        }

        [HttpGet("nutrition")]
        public async Task<ActionResult<string>> GetNutritionData(string query)
        {
            try
            {
                string apiKey = _configuration["NinjasAPIKey:APIKey"];

                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", apiKey);

                HttpResponseMessage response = await _httpClient.GetAsync($"nutrition?query={query}");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    return Ok(result);
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

        [HttpGet("calories-intake")]
        public async Task<string> GetCaloriesIntake(int userId, DateTime startDate, DateTime endDate)
        {
            IEnumerable<NutritionLogs> nutritionLogs = _nutritionLogsRepository.GetNutritionLogsInterval(userId, startDate, endDate).Result;
            double caloriesSum = 0;
            string apiKey = _configuration["NinjasAPIKey:APIKey"];
            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", apiKey);

            List<double> tmp = new();
            //List<object> nutritionItems = new();
            //List<double> proteins = new();

            for (int i = 0; i < nutritionLogs.Count(); i++)
            {
                string conc = nutritionLogs.ElementAt(i).Grams.ToString() + "g " + nutritionLogs.ElementAt(i).FoodConsumed;
                HttpResponseMessage response = await _httpClient.GetAsync($"nutrition?query={conc}");
                string result = await response.Content.ReadAsStringAsync();
                JsonDocument doc = JsonDocument.Parse(result);
                JsonElement root = doc.RootElement;

                if (root.ValueKind == JsonValueKind.Array)
                {
                    var firstElement = root[0];
                    double totalCalories = firstElement.GetProperty("calories").GetDouble();
                    //double totalProteins = firstElement.GetProperty("protein_g").GetDouble();
                    caloriesSum += Math.Round(totalCalories); 
                    tmp.Add(totalCalories);
                    //proteins.Add(totalProteins);
                }

                //var nutritionItem = new
                //{
                //    Name = nutritionLogs.ElementAt(i).FoodConsumed,
                //    Calories = tmp[i],
                //    Proteins = proteins[i]
                //};
                //nutritionItems.Add(nutritionItem);
            }

            //caloriesSum = tmp.Sum();

            var nutritionData = new
            {
                CaloriesSum = caloriesSum,
                //NutritionLogs = nutritionItems
            };

            return JsonSerializer.Serialize(nutritionData);
        }
    }
}
