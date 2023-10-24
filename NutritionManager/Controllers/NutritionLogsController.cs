using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NutritionLogsController
    {
        private readonly DataContext _context;

        public NutritionLogsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<NutritionLogs>> GetAllNutritionLogsAync()
        {
            return await _context.NutritionLogs.ToListAsync();
        }
    }
}
