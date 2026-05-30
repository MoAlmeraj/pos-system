using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.Customer
{
    public class CreateCustomerDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public decimal Balance { get; set; } = 0.00m;
    }
}