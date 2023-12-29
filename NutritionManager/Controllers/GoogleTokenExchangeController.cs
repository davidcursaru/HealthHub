using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using NutritionManager.Services;
using Microsoft.Extensions.Configuration;
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
        private readonly EncryptionService _encryptionService;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public GoogleTokenExchangeController(IHttpClientFactory httpClientFactory, IUserRepository userRepository, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("google/tokenexchange/{userId}")]
        public async Task<IActionResult> ExchangeCodeForTokens([FromBody] string authorizationCode, int userId)
        {
            try
            {
                string clientId = _configuration["GoogleAuth:ClientId"]; ;
                string clientSecret = _configuration["GoogleAuth:ClientSecret"]; 
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

                    User user = await _userRepository.GetUserByIdAync(userId);
                    user.RefreshToken = tokenResponse.Refresh_token;
                    user.AccessToken = tokenResponse.Access_token;
                    await _userRepository.SaveAllAsync();

                    return Ok(200);
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
        
    }
}
