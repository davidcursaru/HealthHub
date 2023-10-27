using Microsoft.AspNetCore.Mvc;
using NutritionManager.DTO;
using NutritionManager.Entities;

namespace NutritionManager.Interfaces
{
    public interface IUserRepository
    {
        Task UpdateUserAsync(UpdatedUserBirthDateDTO user);
        //Task<ActionResult> UpdateUser(UpdatedUser updatedUser);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAync(int id);
        Task<User> GetUserByUsernameAsyc(string username);
        Task<IEnumerable<UserDTO>> GetUsersDtoAsync();
        Task<UserDTO> GetUserDtoAsync(string username);
        Task ChangePassword(UpdatedUserPwdDTO user);
        Task DeleteUserAsync(int id);
    }
}
