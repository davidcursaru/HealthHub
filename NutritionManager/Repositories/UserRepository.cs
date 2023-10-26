using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NutritionManager.Data;
using NutritionManager.DTO;
using NutritionManager.Entities;
using NutritionManager.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace NutritionManager.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task ChangePassword(UpdatedUserDTO user)
        {
            var userToUpdate = GetUserByIdAync(user.Id).Result;

            if (!string.IsNullOrEmpty(user.NewPassword))
            {
                // Generate a new salt
                using var hmac = new HMACSHA512();

                userToUpdate.PasswordSalt = hmac.Key;
                userToUpdate.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(user.NewPassword));
            }
            _context.Users.Update(userToUpdate);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            var userToDelete = GetUserByIdAync(id).Result;
            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUsernameAsyc(string username)
        {
            return await _context.Users
                .Include(g => g.Goals)
                .Include(e => e.ExerciseLogs)
                .Include(h => h.HydrationLogs)
                .Include(n => n.NutritionLogs)
                .Include(r => r.Reminders)
                .SingleOrDefaultAsync(x => x.Username == username);
        }

        public async Task<UserDTO> GetUserDtoAsync(string username)
        {
            return await _context.Users
                .Where(x => x.Username == username)
                .ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<UserDTO>> GetUsersDtoAsync()
        {
            return await _context.Users
                .ProjectTo<UserDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
