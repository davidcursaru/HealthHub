using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HydrationLogsController
    {
        private readonly DataContext _context;

        public HydrationLogsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<HydrationLogs>> GetAllHydrationLogsAsync()
        {
            return await _context.HydrationLogs.ToListAsync();
        }
    }
}
