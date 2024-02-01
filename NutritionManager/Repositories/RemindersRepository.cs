using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Repositories
{
    public class RemindersRepository : IRemindersRepository
    {
        private readonly DataContext _context;

        public RemindersRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Reminders> CreateReminder(Reminders reminder)
        {
            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();
            return reminder;
        }

        public async Task DeleteReminder(int logId, int userId)
        {
            var logToDelete = await _context.Reminders
                 .FirstOrDefaultAsync(x => x.Id == logId && x.UserId == userId);

            if (logToDelete != null)
            {
                _context.Reminders.Remove(logToDelete);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Reminders>> GetAllReminders()
        {
            return await _context.Reminders.ToListAsync();
        }

        public async Task<Reminders> GetReminderById(int id)
        {
            return await _context.Reminders.FindAsync(id);
        }

        public async Task UpdateReminder(Reminders reminder)
        {
            _context.Update(reminder);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RemindersDTO>> GetRemindersForCurrentDay(int userId)
        {
            // Get current date
            DateTime currentDate = DateTime.Now.Date;

            // Query reminders for the current day and map to RemindersDTO
            var remindersForCurrentDay = await _context.Reminders
                .Where(r => EF.Functions.DateDiffDay(r.StartActivity, currentDate) == 0 &&
                            EF.Functions.DateDiffDay(r.EndActivity, currentDate) == 0 && r.UserId == userId)
                .Select(r => new RemindersDTO
                {
                    Id = r.Id,
                    ReminderType = r.ReminderType,
                    StartActivity = r.StartActivity,
                    EndActivity = r.EndActivity
                }).OrderBy(r => r.StartActivity.TimeOfDay)
                .ToListAsync();

            return remindersForCurrentDay;
        }
    }
}
