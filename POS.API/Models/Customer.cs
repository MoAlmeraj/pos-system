namespace POS.API.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public decimal Balance { get; set; } = 0.00m;

        // Navigation properties
        public Tenant Tenant { get; set; } = null!;
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}