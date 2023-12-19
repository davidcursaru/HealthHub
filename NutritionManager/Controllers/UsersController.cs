using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Security.Claims;

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

        //[HttpGet("id/{id}")]
        //public async Task<UserDTO> GetUserById(int id)
        //{
        //    return await _userRepository.GetUserByIdAync(id);
        //}

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
        public async Task ChangePassword(UpdatedUserPwdDTO updatedUser)
        {
            await _userRepository.ChangePassword(updatedUser);
        }

        [HttpPut("update-user")]
        public async Task UpdateUser(UpdatedUserBirthDateDTO user)
        {
            await _userRepository.UpdateUserAsync(user);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateUserAsync(UpdatedUserDTO updatedUserDTO)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsyc(username);

            if(user == null)
            {
                return NotFound();
            }

            _mapper.Map(updatedUserDTO, user);

            if(await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update user");
        }
    }
}
