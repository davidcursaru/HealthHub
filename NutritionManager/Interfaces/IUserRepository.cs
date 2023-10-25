using NutritionManager.DTO;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IUserRepository
    {
        void Update(User user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAync(int id);
        Task<User> GetUserByUsernameAsyc(string username);
        Task<IEnumerable<UserDTO>> GetUsersDtoAsync();
        Task<UserDTO> GetUserDtoAsync(string username);
    }
}
