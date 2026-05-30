namespace POS.API.DTOs.Product
{
    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Barcode { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? CategoryName { get; set; }
        public List<string> SupplierNames { get; set; } = new List<string>();
    }
}