using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController : ControllerBase
    {
        private readonly DataContext _context;

        public GoalsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Goals>> GetAllGoalsAsync()
        {
            return await _context.Goals.ToListAsync();
        }
    }
}
