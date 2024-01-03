using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NutritionLogsController : ControllerBase
    {
        private readonly INutritionLogsRepository _nutritionLogsRepository;

        public NutritionLogsController(INutritionLogsRepository nutritionLogsRepository)
        {
            _nutritionLogsRepository = nutritionLogsRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsAync()
        {
            return await _nutritionLogsRepository.GetAllNutritionLogs();
        }

        [HttpGet("userId/{userId}")]
        public async Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsByUserIdAsync(int userId)
        {
            return await _nutritionLogsRepository.GetAllNutritionLogsByUserId(userId);
        }

        [HttpGet("interval")]
        public async Task<IEnumerable<NutritionLogs>> GetNutritionLogsIntervalAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _nutritionLogsRepository.GetNutritionLogsInterval(userId, startDate, endDate);
        }

        [HttpGet("id/{id}")]
        public async Task<NutritionLogs> GetNutritionLogsById(int id)
        {
            return await _nutritionLogsRepository.GetNutritionLogsById(id);
        }

        [HttpPost]
        public async Task<NutritionLogs> CreateNutritionLogsAsync(NutritionLogs nutritionLogs)
        {
            return await _nutritionLogsRepository.CreateNutritionLogs(nutritionLogs);
        }

        [HttpPut]
        public async Task UpdateNutritionLogsAsync(NutritionLogs nutritionLogs)
        {
            await _nutritionLogsRepository.UpdateNutritionLogs(nutritionLogs);
        }

        [HttpDelete("id/{id}")]
        public async Task DeleteNutritionLogsAsync(int id)
        {
            await _nutritionLogsRepository.DeleteNutritionLogs(id);
        }
    }
}
