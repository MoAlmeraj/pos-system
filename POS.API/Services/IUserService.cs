using POS.API.DTOs.User;

namespace POS.API.Services
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllAsync(int tenantId);
        Task<UserResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<UserResponseDto> CreateAsync(int tenantId, CreateUserDto dto);
        Task<UserResponseDto?> UpdateAsync(int tenantId, int id, UpdateUserDto dto);
        Task<bool> DeleteAsync(int tenantId, int id);
        Task<bool> ChangePasswordAsync(int tenantId, int id, string newPassword);
    }
}