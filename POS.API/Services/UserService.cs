using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.User;
using POS.API.Models;

namespace POS.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Users
                .Where(u => u.TenantId == tenantId)
                .Include(u => u.Role)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    RoleName = u.Role.Name,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<UserResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Id == id);

            if (user == null) return null;

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                RoleName = user.Role.Name,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDto> CreateAsync(int tenantId, CreateUserDto dto)
        {
            // Check if email already exists
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                throw new Exception("A user with this email already exists.");

            // Verify the role exists
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Id == dto.RoleId);
            if (role == null)
                throw new Exception("The specified role does not exist.");

            var user = new User
            {
                TenantId = tenantId,
                RoleId = dto.RoleId,
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                RoleName = role.Name,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDto?> UpdateAsync(int tenantId, int id, UpdateUserDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Id == id);

            if (user == null) return null;

            // Verify the new role exists
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Id == dto.RoleId);
            if (role == null)
                throw new Exception("The specified role does not exist.");

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.RoleId = dto.RoleId;
            user.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                RoleName = role.Name,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int tenantId, int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Id == id);

            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int tenantId, int id, string newPassword)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Id == id);

            if (user == null) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}