namespace POS.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int RoleId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Tenant Tenant { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }
}