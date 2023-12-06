using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RemindersController : ControllerBase
    {
        private readonly IRemindersRepository _remindersRepository;

        public RemindersController(IRemindersRepository remindersRepository)
        {
            _remindersRepository = remindersRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<Reminders>> GetAllRemindersAsync()
        {
            return await _remindersRepository.GetAllReminders();
        }

        [HttpGet("id/{id}")]
        public async Task<Reminders> GetReminderByIdAsync(int id)
        {
            return await _remindersRepository.GetReminderById(id);
        }

        [HttpPost]
        public async Task<Reminders> CreateReminderAsync(Reminders reminder)
        {
            return await _remindersRepository.CreateReminder(reminder);
        }

        [HttpPut]
        public async Task UpdateReminderAsync(Reminders reminder)
        {
            await _remindersRepository.UpdateReminder(reminder);
        }

        [HttpDelete("id/{id}")]
        public async Task DeleteReminderAsync(int id)
        {
            await _remindersRepository.DeleteReminder(id);
        }

        [HttpGet("schedulling")]
        public async Task<IEnumerable<RemindersDTO>> GetRemindersForCurrentDayAsync()
        {
            return await _remindersRepository.GetRemindersForCurrentDay();
        }
    }
}
