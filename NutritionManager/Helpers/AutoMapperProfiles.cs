using AutoMapper;
using NutritionManager.DTO;
using NutritionManager.Entities;

namespace NutritionManager.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserDTO>();
            CreateMap<Goals, GoalsDTO>();
            CreateMap<ExerciseLogs, ExerciseLogsDTO>();
            CreateMap<HydrationLogs, HydrationLogsDTO>();
            CreateMap<NutritionLogs, NutritionLogsDTO>();
            CreateMap<Reminders, RemindersDTO>();
        }
    }
}
