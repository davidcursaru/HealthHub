using Microsoft.AspNetCore.Mvc;
using NutritionManager.Interfaces;

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

    }
}
