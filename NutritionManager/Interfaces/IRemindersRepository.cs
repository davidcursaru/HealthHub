using NutritionManager.DTO;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IRemindersRepository
    {
        Task<Reminders> CreateReminder(Reminders reminder);
        Task<IEnumerable<Reminders>> GetAllReminders();
        Task<Reminders> GetReminderById(int id);
        Task UpdateReminder(Reminders reminder);
        Task DeleteReminder(int id);
        Task<IEnumerable<RemindersDTO>> GetRemindersForCurrentDay(int userId);
    }
}
