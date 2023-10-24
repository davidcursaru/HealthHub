using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.Interfaces;
using NutritionManager.Services;

namespace NutritionManager.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("connection_string"));
            });

            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
