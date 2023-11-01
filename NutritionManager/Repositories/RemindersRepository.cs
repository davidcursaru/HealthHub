using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
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

        public async Task DeleteReminder(int id)
        {
            var reminderToDelete = GetReminderById(id).Result;
            _context.Reminders.Remove(reminderToDelete);
            await _context.SaveChangesAsync();
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
    }
}
