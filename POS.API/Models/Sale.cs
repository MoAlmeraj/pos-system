namespace POS.API.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;

        // Navigation properties
        public Tenant Tenant { get; set; } = null!;
        public Customer? Customer { get; set; }
        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}