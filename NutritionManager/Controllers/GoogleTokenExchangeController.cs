using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleTokenExchangeController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public GoogleTokenExchangeController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("google/tokenexchange")]
        public async Task<IActionResult> ExchangeCodeForTokens([FromBody] string authorizationCode)
        {
            try
            {
                string clientId = "127406299666-bclt8sqnp7kitp93tepatq1pk63p3273.apps.googleusercontent.com";
                string clientSecret = "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";
                string redirectUri = "http://localhost:4200/layout/dashboard";

                var requestData = new Dictionary<string, string>
                {
                    { "code", authorizationCode },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                };

                var client = _httpClientFactory.CreateClient();

                var response = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(requestData));

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    // Store tokens securely in your backend or perform further actions with the tokens
                    return Ok(tokenResponse);
                }
                else
                {
                    return BadRequest("Failed to exchange code for tokens.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

    public class TokenResponse
    {
        public string Access_token { get; set; }
        public string Refresh_token { get; set; }
        // Add other token-related properties if needed
    }
}
