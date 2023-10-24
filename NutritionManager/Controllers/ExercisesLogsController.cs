using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesLogsController
    {
        private readonly DataContext _context;

        public ExercisesLogsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<ExerciseLogs>> GetAllExercisesLogsAsync()
        {
            return await _context.ExerciseLogs.ToListAsync();
        }

    }
}
