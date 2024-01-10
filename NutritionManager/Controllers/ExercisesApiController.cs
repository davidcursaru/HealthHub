using Microsoft.AspNetCore.Mvc;
using NutritionManager.Interfaces;

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

    }
}
