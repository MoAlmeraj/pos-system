namespace POS.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int? CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Barcode { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; } = 0;

        // Navigation properties
        public Tenant Tenant { get; set; } = null!;
        public Category? Category { get; set; }
        public ICollection<ProductSupplier> ProductSuppliers { get; set; } = new List<ProductSupplier>();
        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}