using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.Auth
{
    public class RegisterTenantDto
    {
        [Required]
        [MaxLength(100)]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string BusinessEmail { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? BusinessPhone { get; set; }

        [Required]
        [MaxLength(100)]
        public string AdminName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string AdminEmail { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string AdminPassword { get; set; } = string.Empty;
    }
}