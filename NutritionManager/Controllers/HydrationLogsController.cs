using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
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

        [HttpGet("id/{id}")]
        public async Task<HydrationLogs> GetHydrationLogsByIdAsync(int id)
        {
            return await _hydrationLogsRepository.GetHydrationLogsById(id);
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

        [HttpDelete]
        public async Task DeleteHydrationLogsAsync(int id)
        {
            await _hydrationLogsRepository.DeleteHydrationLogs(id);
        }
    }
}
