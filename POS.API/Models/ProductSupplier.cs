namespace POS.API.Models
{
    public class ProductSupplier
    {
        public int ProductId { get; set; }
        public int SupplierId { get; set; }

        // Navigation properties
        public Product Product { get; set; } = null!;
        public Supplier Supplier { get; set; } = null!;
    }
}