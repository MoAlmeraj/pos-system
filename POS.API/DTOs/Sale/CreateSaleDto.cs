using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.Sale
{
    public class CreateSaleDto
    {
        public int? CustomerId { get; set; }

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "A sale must have at least one item")]
        public List<CreateSaleItemDto> Items { get; set; } = new List<CreateSaleItemDto>();
    }
}