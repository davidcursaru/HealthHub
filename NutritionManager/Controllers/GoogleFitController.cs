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


        //Fetch the step count from Google FIT in a time range

        [HttpPost("StepsCount/{userId}")]
        public async Task<IActionResult> GetStepCount(int userId, [FromBody] TimeRangeRequest timeRangeRequest)
        {
            try
            {
                
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
                            dataTypeName = "com.google.step_count.delta",
                            dataSourceId = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                        }
                    },
                    bucketByTime = new { durationMillis = 86400000 },
                    startTimeMillis = timeRangeRequest.StartTimeMillis,
                    endTimeMillis = timeRangeRequest.EndTimeMillis
                };

                var client = _httpClientFactory.CreateClient();

                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent); 
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        
                        var tokenRefreshed = await RefreshAccessToken(refreshToken, userId);
                        if (tokenRefreshed)
                        {
                            
                            accessToken = user.AccessToken;

                            client.DefaultRequestHeaders.Remove("Authorization");
                            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                            var retryResponse = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                            if (retryResponse.IsSuccessStatusCode)
                            {
                                var retryResponseContent = await retryResponse.Content.ReadAsStringAsync();
                                return Ok(retryResponseContent); 
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


        //Fetch the Burned calories from Google FIT in a time range

        [HttpPost("BurnedCalories/{userId}")]
        public async Task<IActionResult> GetBurnedCalories(int userId, [FromBody] TimeRangeRequest timeRangeRequest)
        {
            try
            {
                
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
                            dataTypeName = "com.google.calories.expended",
                            dataSourceId = "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
                        }
                    },
                    bucketByTime = new { durationMillis = 86400000 },
                    startTimeMillis = timeRangeRequest.StartTimeMillis,
                    endTimeMillis = timeRangeRequest.EndTimeMillis
                };

                var client = _httpClientFactory.CreateClient();

                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent); 
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        var tokenRefreshed = await RefreshAccessToken(refreshToken, userId);
                        if (tokenRefreshed)
                        {
                            
                            accessToken = user.AccessToken;

                            client.DefaultRequestHeaders.Remove("Authorization");
                            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                            var retryResponse = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                            if (retryResponse.IsSuccessStatusCode)
                            {
                                var retryResponseContent = await retryResponse.Content.ReadAsStringAsync();
                                return Ok(retryResponseContent); 
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



        //Fetch the active minutes from Google FIT in a time range

        [HttpPost("ActiveMinutes/{userId}")]
        public async Task<IActionResult> GetActiveMinutes(int userId, [FromBody] TimeRangeRequest timeRangeRequest)
        {
            try
            {
               
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
                            dataTypeName =  "com.google.active_minutes",
                            dataSourceId = "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
                        }
                    },
                    bucketByTime = new { durationMillis = 86400000 },
                    startTimeMillis = timeRangeRequest.StartTimeMillis,
                    endTimeMillis = timeRangeRequest.EndTimeMillis
                };

                var client = _httpClientFactory.CreateClient();

                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent); 
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        
                        var tokenRefreshed = await RefreshAccessToken(refreshToken, userId);
                        if (tokenRefreshed)
                        {
                            
                            accessToken = user.AccessToken;

                            client.DefaultRequestHeaders.Remove("Authorization");
                            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                            var retryResponse = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                            if (retryResponse.IsSuccessStatusCode)
                            {
                                var retryResponseContent = await retryResponse.Content.ReadAsStringAsync();
                                return Ok(retryResponseContent); 
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



        //Fetch the heart minutes from Google FIT in a time range

        [HttpPost("HeartMinutes/{userId}")]
        public async Task<IActionResult> GetHeartMinutes(int userId, [FromBody] TimeRangeRequest timeRangeRequest)
        {
            try
            {
               
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
                            dataTypeName =  "com.google.heart_minutes",
                            dataSourceId = "derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes"
                        }
                    },
                    bucketByTime = new { durationMillis = 86400000 },
                    startTimeMillis = timeRangeRequest.StartTimeMillis,
                    endTimeMillis = timeRangeRequest.EndTimeMillis
                };

                var client = _httpClientFactory.CreateClient();

                
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent); 
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        
                        var tokenRefreshed = await RefreshAccessToken(refreshToken, userId);
                        if (tokenRefreshed)
                        {
                            
                            accessToken = user.AccessToken;

                            client.DefaultRequestHeaders.Remove("Authorization");
                            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                            var retryResponse = await client.PostAsync("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", content);

                            if (retryResponse.IsSuccessStatusCode)
                            {
                                var retryResponseContent = await retryResponse.Content.ReadAsStringAsync();
                                return Ok(retryResponseContent); 
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
            User user = await _userRepository.GetUserByIdAync(userId);

            try
            {
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
                    
                    user.AccessToken = RefreshedTokenResponse.Access_token;
                    await _userRepository.SaveAllAsync();

                    return true; 
                }
                else
                {
                    
                    return false; 
                }
            }
            catch (Exception)
            {
                return false; 
            }
        }
    }


    public class TimeRangeRequest
    {
        public long StartTimeMillis { get; set; }
        public long EndTimeMillis { get; set; }
    }

    public class RefreshedTokenResponse
    {
        public string Access_token { get; set; }
       
    }
}
