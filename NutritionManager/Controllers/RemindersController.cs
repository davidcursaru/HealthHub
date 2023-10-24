using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RemindersController
    {
        private readonly DataContext _context;

        public RemindersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Reminders>> GetAllRemindersAsync()
        {
            return await _context.Reminders.ToListAsync();
        } 
    }
}
