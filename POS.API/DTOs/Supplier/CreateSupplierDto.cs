using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.Supplier
{
    public class CreateSupplierDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
    }
}