using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
