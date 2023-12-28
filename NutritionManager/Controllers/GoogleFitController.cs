using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using NutritionManager.Repositories;
using NutritionManager.Services;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleFitController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public GoogleFitController(IHttpClientFactory httpClientFactory, IUserRepository userRepository, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("dailysteps/{userId}")]
        public async Task<IActionResult> GetDailyStepCount(int userId, [FromBody] DailyStepCountRequest dailyStepCountRequest)
        {
            try
            {
                // Retrieve user's access token and refresh token from the database based on the userId
                // This assumes you have a service or repository to fetch user data
                User user = await _userRepository.GetUserByIdAync(userId);


                if (user == null)
                {
                    return NotFound("User not found");
                }

                string accessToken = user.AccessToken;
                string refreshToken = user.RefreshToken;
               

                var requestData = new
                {
                    aggregateBy = new[]
                    {
                        new
                        {
                            dataTypeName = "com.google.active_minutes",
                            dataSourceId = "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
                        }
                    },
                    bucketByTime = new { durationMillis = 86400000 },
                    startTimeMillis = dailyStepCountRequest.StartTimeMillis,
                    endTimeMillis = dailyStepCountRequest.EndTimeMillis
                };

                var client = _httpClientFactory.CreateClient();

                // Add necessary headers (Authorization header with access token)
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    // Parse content to extract daily step count information
                    //var dailyStepCount = ParseContentForStepCount(responseContent);
                    return Ok(responseContent); // Return the step count or relevant information
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        // Access token expired, attempt to refresh the token
                        var tokenRefreshed = await RefreshAccessToken(refreshToken, userId);
                        if (tokenRefreshed)
                        {
                            // Retry step count request after obtaining the new access token
                            accessToken = user.AccessToken;

                            client.DefaultRequestHeaders.Remove("Authorization");
                            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                            var retryResponse = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                            if (retryResponse.IsSuccessStatusCode)
                            {
                                var retryResponseContent = await retryResponse.Content.ReadAsStringAsync();
                                return Ok(retryResponseContent); // Return the step count or relevant information
                            }
                        }
                    }
                    return BadRequest("Failed to fetch daily step count from Google Fit API.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private async Task<bool> RefreshAccessToken(string refreshToken, int userId)
        {
            // Implement logic to refresh the access token using the provided refresh token
            // Make a request to the OAuth2 token endpoint with the refresh token
            // Parse the response to obtain the new access token and update the database
            // Return true if the access token was successfully refreshed, false otherwise
            User user = await _userRepository.GetUserByIdAync(userId);

            try
            {
                // Example code to refresh the access token using the refresh token
                var tokenRefreshUrl = "https://oauth2.googleapis.com/token";

                string clientId = _configuration["GoogleAuth:ClientId"]; 
                string clientSecret = _configuration["GoogleAuth:ClientSecret"];

                var requestData = new Dictionary<string, string>
                {
                    { "refresh_token", refreshToken },
                    { "client_id", clientId  },
                    { "client_secret", clientSecret },
                    { "grant_type", "refresh_token" }
                };

                var client = _httpClientFactory.CreateClient();
                var response = await client.PostAsync(tokenRefreshUrl, new FormUrlEncodedContent(requestData));

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var RefreshedTokenResponse = JsonSerializer.Deserialize<RefreshedTokenResponse>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    // Parse refreshedTokenResponse to extract the new access token
                    // Update the database with the new access token for the user
                    user.AccessToken = RefreshedTokenResponse.Access_token;
                    await _userRepository.SaveAllAsync();

                    return true; // Access token refreshed successfully
                }
                else
                {
                    // Handle the case where token refresh fails
                    return false; // Access token refresh failed
                }
            }
            catch (Exception)
            {
                return false; // Access token refresh failed due to an exception
            }
        }
    }

    public class DailyStepCountRequest
    {
        public long StartTimeMillis { get; set; }
        public long EndTimeMillis { get; set; }
    }

    public class RefreshedTokenResponse
    {
        public string Access_token { get; set; }
       
    }
}
