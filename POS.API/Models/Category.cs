namespace POS.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Navigation properties
        public Tenant Tenant { get; set; } = null!;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}