using AutoMapper;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Extensions;

namespace NutritionManager.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<UserDTO, User>();
            CreateMap<UpdatedUserDTO, User>();
            CreateMap<Goals, GoalsDTO>();
            CreateMap<ExerciseLogs, ExerciseLogsDTO>();
            CreateMap<HydrationLogs, HydrationLogsDTO>();
            CreateMap<NutritionLogs, NutritionLogsDTO>();
            CreateMap<Reminders, RemindersDTO>();
        }
    }
}
