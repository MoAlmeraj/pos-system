using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using POS.API.Data;
using POS.API.DTOs.Auth;
using POS.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace POS.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterTenantDto dto)
        {
            // 1. Check if business email already exists
            var tenantExists = await _context.Tenants
                .AnyAsync(t => t.Email == dto.BusinessEmail);
            if (tenantExists)
                throw new Exception("A business with this email already exists.");

            // 2. Check if admin email already exists
            var userExists = await _context.Users
                .AnyAsync(u => u.Email == dto.AdminEmail);
            if (userExists)
                throw new Exception("A user with this email already exists.");

            // 3. Create the tenant
            var tenant = new Tenant
            {
                Name = dto.BusinessName,
                Email = dto.BusinessEmail,
                Phone = dto.BusinessPhone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            // 4. Find or create the Admin role
            var adminRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
            {
                adminRole = new Role { Name = "Admin", Description = "Full access" };
                _context.Roles.Add(adminRole);
                await _context.SaveChangesAsync();
            }

            // 5. Create the admin user with hashed password
            var user = new User
            {
                TenantId = tenant.Id,
                RoleId = adminRole.Id,
                Name = dto.AdminName,
                Email = dto.AdminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.AdminPassword),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 6. Generate and return JWT token
            var token = GenerateToken(user, tenant.Name, adminRole.Name);
            return new AuthResponseDto
            {
                Token = token,
                UserName = user.Name,
                UserEmail = user.Email,
                RoleName = adminRole.Name,
                TenantName = tenant.Name
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            // 1. Find user by email
            var user = await _context.Users
                .Include(u => u.Tenant)
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                throw new Exception("Invalid email or password.");

            // 2. Check if account is active
            if (!user.IsActive)
                throw new Exception("This account has been disabled.");

            // 3. Verify password
            var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!passwordValid)
                throw new Exception("Invalid email or password.");

            // 4. Generate and return JWT token
            var token = GenerateToken(user, user.Tenant.Name, user.Role.Name);
            return new AuthResponseDto
            {
                Token = token,
                UserName = user.Name,
                UserEmail = user.Email,
                RoleName = user.Role.Name,
                TenantName = user.Tenant.Name
            };
        }

        private string GenerateToken(User user, string tenantName, string roleName)
        {
            var jwtSecret = _configuration["JwtSettings:Secret"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("userId",   user.Id.ToString()),
                new Claim("tenantId", user.TenantId.ToString()),
                new Claim("role",     roleName),
                new Claim("email",    user.Email)
            };

            var expiryDays = int.Parse(_configuration["JwtSettings:ExpiryInDays"]!);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(expiryDays),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}