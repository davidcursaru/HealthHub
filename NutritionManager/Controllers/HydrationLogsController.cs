using Microsoft.AspNetCore.Mvc;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HydrationLogsController : ControllerBase
    {
        private readonly IHydrationLogsRepository _hydrationLogsRepository;

        public HydrationLogsController(IHydrationLogsRepository hydrationLogsRepository)
        {
            _hydrationLogsRepository = hydrationLogsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<HydrationLogs>> GetAllHydrationLogsAsync()
        {
            return await _hydrationLogsRepository.GetAllHydrationLogs();
        }

        [HttpGet("userId/{userId}")]
        public async Task<IEnumerable<HydrationLogs>> GetAllHydrationLogsByUserIdAsync(int userId)
        {
            return await _hydrationLogsRepository.GetAllHydrationLogsByUserId(userId);
        }

        [HttpGet("id/{id}")]
        public async Task<HydrationLogs> GetHydrationLogsByIdAsync(int id)
        {
            return await _hydrationLogsRepository.GetHydrationLogsById(id);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetHydrationLogsCountForDateRange(int userId, DateTime startDate, DateTime endDate)
        {
            try
            {
                int quantity = await _hydrationLogsRepository.GetHydrationLogsCount(userId, startDate, endDate);
                return Ok(quantity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<HydrationLogs> CreateHydrationLogsAsync(HydrationLogs hydrationLogs)
        {
            return await _hydrationLogsRepository.CreateHydrationLogs(hydrationLogs);
        }

        [HttpPut]
        public async Task UpdateHydrationLogsAsync(HydrationLogs hydrationLogs)
        {
            await _hydrationLogsRepository.UpdateHydrationLogs(hydrationLogs);
        }

        [HttpDelete("id/{id}")]
        public async Task DeleteHydrationLogsAsync(int id)
        {
            await _hydrationLogsRepository.DeleteHydrationLogs(id);
        }
    }
}
