namespace POS.API.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}