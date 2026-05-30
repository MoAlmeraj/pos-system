namespace POS.API.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string TenantName { get; set; } = string.Empty;
    }
}