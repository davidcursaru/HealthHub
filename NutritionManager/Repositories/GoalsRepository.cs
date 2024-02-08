using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Text.Json;

namespace NutritionManager.Repositories
{
    public class GoalsRepository : IGoalsRepository
    {
        private readonly DataContext _context;

        public GoalsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Goals> CreateGoal(Goals goal)
        {
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task DeleteGoals(int logId, int userId)
        {
            var goalToDelete = await _context.Goals
                .FirstOrDefaultAsync(x => x.Id == logId && x.UserId == userId);

            if (goalToDelete != null)
            {
                _context.Goals.Remove(goalToDelete);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Goals>> GetAllGoalsAsync()
        {
            return await _context.Goals.ToListAsync();
        }

        public async Task<IEnumerable<Goals>> GetAllGoalsByUserId(int userId)
        {
            var goals = await _context.Goals.Where(g => g.UserId == userId).ToListAsync();
            return goals;
        }

        public async Task<Goals> GetGoalByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public async Task<int> GetGoalsTotalValueForCurrentDay(string goalType, int userId)
        {
            //var totalValue = await _context.Goals
            //    .Where(g => g.UserId == userId &&
            //    g.GoalType == goalType && 
            //    (g.StartGoalDate.DayOfYear == DateTime.Now.DayOfYear && g.StartGoalDate.Year == DateTime.Now.Year) && 
            //    (g.Deadline.DayOfYear == DateTime.Now.DayOfYear && g.Deadline.Year == DateTime.Now.Year))
            //    .Select(g => g.TargetValue).SumAsync();
            //return totalValue;
            var tomorrow = DateTime.Now.AddDays(1).Date;
            var totalValue = await _context.Goals
                .Where(r => r.Deadline >= DateTime.Now
                
                && r.UserId == userId
                && r.GoalType == goalType)
                .Select(g => g.TargetValue).SumAsync();

            return totalValue;
        }

        public async Task<IEnumerable<Goals>> GetGoalLogsInterval(int userId, DateTime startDate, DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var goalLogs = await _context.Goals
                .Where(r => r.StartGoalDate >= startDate.Date && r.StartGoalDate <= endDate.Date && r.UserId == userId).ToListAsync();

            return goalLogs;
        }

        public async Task<int> GetGoalsValueForInterval(int userId, string goalType, DateTime startDate, DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            var goals = await _context.Goals
                .Where(r => r.StartGoalDate >= startDate.Date
                && r.Deadline <= endDate.Date
                && r.UserId == userId
                && r.GoalType == goalType)
                .Select(g => g.TargetValue).SumAsync();

            return goals;
        }

        public async Task<string> GetGoalsData(int userId, [FromQuery(Name = "startDate")] DateTime startDate, [FromQuery(Name = "endDate")] DateTime endDate)
        {
            if (startDate.Date == endDate.Date)
            {
                endDate = endDate.AddDays(1);
            }
            else
            {
                endDate = endDate.AddDays(1);
            }

            IEnumerable<Goals> goalsList = await GetGoalLogsInterval(userId, startDate, endDate);

            List<object> goalsDataList = new List<object>();

            foreach (var goal in goalsList)
            {
                var goalsData = new
                {
                    type = goal.GoalType,
                    target = goal.TargetValue,
                    startDate = goal.StartGoalDate,
                    deadline = goal.Deadline,
                    logId = goal.Id
                };

                goalsDataList.Add(goalsData);
            }

            return JsonSerializer.Serialize(goalsDataList);
        }

        public async Task UpdateGoalAsync(Goals goals)
        {
            _context.Update(goals);
            await _context.SaveChangesAsync();
        }
    }
}
