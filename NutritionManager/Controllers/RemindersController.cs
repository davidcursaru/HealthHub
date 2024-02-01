using Microsoft.AspNetCore.Mvc;
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

        [HttpDelete]
        public async Task DeleteReminderAsync(int logId, int userId)
        {
            await _remindersRepository.DeleteReminder(logId, userId);
        }

        [HttpGet("schedulling/{loggedUserId}")]
        public async Task<IEnumerable<RemindersDTO>> GetRemindersForCurrentDayAsync(int loggedUserId)
        {
            return await _remindersRepository.GetRemindersForCurrentDay(loggedUserId);
        }
    }
}
