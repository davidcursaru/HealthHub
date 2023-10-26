using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;

namespace NutritionManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _userRepository.GetUsersDtoAsync();
            return Ok(users);
        }

        [HttpGet("username/{username}")]
        public async Task<ActionResult<UserDTO>> GetUserByUsername(string username)
        {
            return await _userRepository.GetUserDtoAsync(username);
        }

        [HttpDelete("delete/{id}")]
        public async Task DeleteUser(int id)
        {
            await _userRepository.DeleteUserAsync(id);
        }

        [HttpPut("change-password")]
        public async Task ChangePassword(UpdatedUserDTO updatedUser)
        {
            await _userRepository.ChangePassword(updatedUser);
        }
    }
}
