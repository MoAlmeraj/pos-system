using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs.Product
{
    public class UpdateProductDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Barcode { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        public int? CategoryId { get; set; }

        public List<int> SupplierIds { get; set; } = new List<int>();
    }
}