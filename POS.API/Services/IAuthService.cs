using POS.API.DTOs.Auth;

namespace POS.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterTenantDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
    }
}