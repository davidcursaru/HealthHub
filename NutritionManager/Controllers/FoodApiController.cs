using Microsoft.AspNetCore.Mvc;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodApiController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public FoodApiController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://api.api-ninjas.com/v1/");
        }

        [HttpGet("nutrition")]
        public async Task<ActionResult<string>> GetNutritionData(string query)
        {
            try
            {
                string apiKey = "fbr6JUc9cxJKGnhXgfHMWw==FDIAvsijhTShl7hI"; // Replace with your actual API key

                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", apiKey);

                HttpResponseMessage response = await _httpClient.GetAsync($"nutrition?query={query}");

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
