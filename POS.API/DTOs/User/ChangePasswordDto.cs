using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.User
{
    public class ChangePasswordDto
    {
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
}